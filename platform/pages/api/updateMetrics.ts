import type { NextApiRequest, NextApiResponse } from "next";

import db, { setViewMetrics } from "../../components/polybase";
import { getVideoMetrics } from "../../components/livepeer";

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  /// gets the data of the signed up creators
  const creators = await db.collection("CreatorProfile").get();

  const { data: creatorData } = creators;
  console.log(creatorData);

  let promises;

  /// gets thier videos
  creatorData?.map(async (creator, id) => {
    const creatorVideos = await creator.data?.videos;
    promises.push(creatorVideos);
  });

  let videos: [string[]] = await Promise.all(promises);

  let promises2;

  /// gets views and watchHours from Livepeer
  /// calculate total for each creator and store
  videos?.map(async (video, id) => {
    let totalViews;
    let totalWatchMin;

    // add Up the indiv video data
    video.map(async (playbackId) => {
      const data = await getVideoMetrics(playbackId);
      totalViews += data.viewCount;
      totalWatchMin += data.playtimeMins;
    });

    const finalData = {
      viewCount: totalViews,
      playtimeMins: totalWatchMin,
      creatorId: creatorData[id].data?.videos,
    };

    promises2.push(finalData);
  });

  let metrics: [{ viewCount: any; playtimeMins: any; creatorId: any }] =
    await Promise.all(promises2);

  let totalMetrics: {
    views: any;
    watchMins: any;
  };

  /// update them in the polybase database
  await metrics.map(async (metric) => {
    totalMetrics.views += metric.viewCount;
    totalMetrics.watchMins += metric.playtimeMins;

    await setViewMetrics(
      metric.creatorId,
      metric.viewCount,
      metric.playtimeMins
    );
  });

  /// Also need to record total views for the platform in total
  await setViewMetrics("0", totalMetrics?.views, totalMetrics?.watchMins);
  /// Store them in the ID - 0;
  return res.status(200).send("OK");
}
