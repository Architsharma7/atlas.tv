import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default (request: NextRequest) => {
  /// gets the data of the signed up creators
  const creators = [];

  /// gets thier videos

  /// gets views and watchHours from Livepeer
  /// calculate total for each creator and store
  /// update them in the polybase database

  /// Also need to record total views for the platform in total
  /// Store them in the ID - 0;
  return NextResponse.json({
    name: `Successfully Updated the new metrics ${request.ip}`,
  });
};
