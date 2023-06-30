import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Player } from "@livepeer/react";

const Videoid = () => {
  const router = useRouter();
  const [publicationId, setPublicationId] = useState();
  useEffect(() => {
    const id = router.query.videoid;
    if (id) {
      setPublicationId(id);
    }
  }, [router.query.videoid]);

  return (
    <div className="w-screen">
      <div className="flex flex-col w-2/3 justify-center items-center mx-auto">
        <div className="h-screen">
          <div className="w-full h-2/3">
            <div className="mt-10">
              <Player playbackId={publicationId}></Player>
              <p className="mt-3 text-xl">
                By archit.test
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videoid;
