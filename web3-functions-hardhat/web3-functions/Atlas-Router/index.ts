import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers"; // we recommend using ky as axios doesn't support fetch by default
// import db, { setViewMetrics } from "../../../platform/components/polybase";
import { Polybase } from "@polybase/client";

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
        name: "shares",
        type: "int96[]",
      },
      {
        internalType: "int96",
        name: "totalShares",
        type: "int96",
      },
    ],
    name: "distributeSubscriptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Atlas_Router_Address = "0x8e2412Aa03A75dF7C76E497bdda059c6C2850079";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage, multiChainProvider } = context;

  const provider = multiChainProvider.default();
  const lastRun = Number(await storage.get("lastRun")) ?? 0;
  const timestamp = (await provider.getBlock("latest")).timestamp;
  const nextRun = lastRun + 86400;

  if (timestamp < nextRun) {
    return { canExec: false, message: `Time Passage not Passed` };
  }

  await storage.set("lastRun", timestamp.toString());

  const db = new Polybase({
    defaultNamespace:
      "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
  });

  const AtlasRouterInterface = new utils.Interface(Atlas_Router_ABI);
  let creators: string[] | any;
  let shares: number[] | any;

  /// fetch all the inflow for the subscriptions to the contract
  let totalShares = 0;

  try {
    // fetch all the creators first
    // fetch the views data for these creators
    const views = await db.collection("ViewMetrics").get();
    console.log(views.data);

    const totalViews = await db.collection("ViewMetrics").record("0").get();
    const totalViewData = totalViews.data;
    console.log(totalViewData);
    totalShares = totalViewData.dayViews;

    const { data: viewData } = views;
    console.log(viewData);

    // then prepare the arguements

    let promises1;
    let promises2;

    viewData.map((view) => {
      promises1.push(view.data.address);
      const share = view.data.dayViews;
      promises2.push(share);
    });

    creators = await Promise.all(promises1);
    shares = await Promise.all(promises2);

    return {
      canExec: true,
      callData: [
        {
          to: Atlas_Router_Address,
          data: AtlasRouterInterface.encodeFunctionData(
            "distributeSubscriptions",
            [creators, shares, totalShares]
          ),
        },
      ],
    };
    // return the canExec and callData
  } catch (err) {
    console.log(err);
    return { canExec: false, message: `Processing failed` };
  }
});
