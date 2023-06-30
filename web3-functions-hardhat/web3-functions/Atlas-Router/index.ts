import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers";
import ky from "ky"; // we recommend using ky as axios doesn't support fetch by default

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

  // fetch all the creators first
  // fetch the views data for these creators
  // then prepare the arguements
  // return the canExec and callData

  const AtlasRouterInterface = new utils.Interface(Atlas_Router_ABI);

  try {
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
          [creators, shares]
        ),
      },
    ],
  };
});
