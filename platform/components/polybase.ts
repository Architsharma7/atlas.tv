import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

/// need to create the View Record while creating a creator record

export const readCreatorMetrics = async (profileId: string) => {
  const game = await db.collection("ViewMetrics").record(profileId).get();
  return game;
};

export const setViewMetrics = async (
  profileId: string,
  newViews: number,
  newWatchHours: number
) => {
  db.signer(async (data) => {
    const accounts = await eth.requestAccounts();
    const account = accounts[0];

    const sig = await eth.sign(data, account);
    return { h: "eth-personal-sign", sig };
  });
  const timeStamp = Math.floor(Date.now() / 1000);
  await db
    .collection("ArkID")
    ?.record(profileId)
    .call("updateViewMetrics", [newViews, newWatchHours, timeStamp]);
};

export default db;
