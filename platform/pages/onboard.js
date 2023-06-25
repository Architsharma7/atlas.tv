import { useRouter } from "next/router";
import React, { useState } from "react";

const Onboard = () => {
    const router = useRouter();

  return (
    <div className="w-screen">
      <div className="flex justify-center items-center mx-auto">
        <div className="mt-10 flex flex-col items-center">
          <div className="">
            <p className="text-5xl font-semibold">
              Welcome to <span className="text-green-500">Atlas.tv 🎉</span>
            </p>
            <p className="mt-10 text-2xl text-center font-medium">
              Choose what role fits you.
            </p>
          </div>
          <div className="mt-28 w-3/5">
            <div className="grid grid-cols-2 grid-rows-1 gap-x-20">
              <div
                onClick={() => router.push("/creatoronboard")}
                className="border-2 border-black rounded-xl px-10 py-4 hover:scale-105 hover:border-green-500 duration-200 cursor-pointer"
              >
                <p className="text-2xl font-medium text-black text-center">
                  Creator 🕺
                </p>
                <p className="text-lg mt-4">
                  Create content on Lens and have a very wide audience, ensuring
                  more engagement and get paid on streams with every view you
                  get.
                </p>
              </div>
              <div
                 onClick={() => router.push("/useronboard")}
                className="border-2 border-black rounded-xl px-10 py-4 hover:scale-105 hover:border-green-500 duration-200 cursor-pointer"
              >
                <p className="text-2xl font-medium text-black text-center">
                  Viewer 🥸
                </p>
                <p className="text-lg mt-4">
                  Watch your favourite creators content with just a single
                  subscription and help them grow.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-32 text-xl">
            <p>
              Doesn't matter who you are, what's your role, you are gonna vibe
              here. 😎
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
