import { createReactClient, studioProvider } from "@livepeer/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "87a6417d-254e-416c-9dbe-f2acacabb78f",
  }),
});

export { livepeerClient };
