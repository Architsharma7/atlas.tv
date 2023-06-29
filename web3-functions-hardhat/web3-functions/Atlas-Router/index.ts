import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { utils } from "ethers";
import ky from "ky"; // we recommend using ky as axios doesn't support fetch by default

const Atlas_Router_ABI = [];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage, multiChainProvider } = context;

  const provider = multiChainProvider.default();
  const adBoardAddress =
    (userArgs.adBoard as string) ??
    "0x28a0A1C63E7E8F0DAe5ad633fe232c12b489d5f0";

  const lastPost = Number(await storage.get("lastPost")) ?? 0;
  //   const adBoardInterface = new utils.Interface(AD_BOARD_ABI);

  const nextPostTime = lastPost + 3600; // 1h
  const timestamp = (await provider.getBlock("latest")).timestamp;

  if (timestamp < nextPostTime) {
    return { canExec: false, message: `Time not elapsed` };
  }

  try {
  } catch (err) {
    return { canExec: false, message: `QuoteApi call failed` };
  }

  await storage.set("lastPost", timestamp.toString());

  return {
    canExec: true,
    callData: [
      {
        to: adBoardAddress,
        data: adBoardInterface.encodeFunctionData("postMessage", [message]),
      },
    ],
  };
});
