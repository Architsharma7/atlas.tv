import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

export default db