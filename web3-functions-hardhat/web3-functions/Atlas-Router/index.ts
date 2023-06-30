import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers"; // we recommend using ky as axios doesn't support fetch by default
import db, { setViewMetrics } from "../../../platform/components/polybase";

const Atlas_Router_ABI = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "creators",
        type: "address[]",
      },
      {
        internalType: "int96[]",
        name: "flowRates",
        type: "int96[]",
      },
    ],
    name: "distributeSubscriptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const Atlas_Router_Address = "0xF9c9a7271468e719604CeAEF0fBb0d98007bF4FC";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage, multiChainProvider } = context;

  const AtlasRouterInterface = new utils.Interface(Atlas_Router_ABI);
  let creators: string[] | any;
  let flowRates: number[] | any;

  /// fetch all the inflow for the subscriptions to the contract
  const totalFlow = 0;

  try {
    // fetch all the creators first
    // fetch the views data for these creators
    const views = await db.collection("ViewMetrics").get();

    const totalViews = await db.collection("ViewMetrics").record("0").get();
    const totalViewData = totalViews.data;

    const { data: viewData } = views;
    console.log(viewData);

    // then prepare the arguements

    let promises1;
    let promises2;

    viewData.map((view) => {
      promises1.push(view.data.address);
      const share = view.data.dayViews / totalViewData.dayViews;
      const flowRate = totalFlow * share;
    });

    creators = await Promise.all(promises1);

    // return the canExec and callData
  } catch (err) {
    return { canExec: false, message: `QuoteApi call failed` };
  }

  return {
    canExec: true,
    callData: [
      {
        to: Atlas_Router_Address,
        data: AtlasRouterInterface.encodeFunctionData(
          "distributeSubscriptions",
          [creators, flowRates]
        ),
      },
    ],
  };
});
