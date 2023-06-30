import { createReactClient, studioProvider } from "@livepeer/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "87a6417d-254e-416c-9dbe-f2acacabb78f",
  }),
});

const API_TOKEN = "87a6417d-254e-416c-9dbe-f2acacabb78f";

export const getVideoMetrics = async (playBackId: string) => {
  const response = await fetch(
    `https://livepeer.studio/api/data/views/query/total/${playBackId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );

  const { playbackId, dStorageUrl, viewCount, playtimeMins } =
    await response.json();

  return {
    viewCount,
    playtimeMins,
  };
};

export { livepeerClient };
