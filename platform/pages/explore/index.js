import React, { useEffect } from "react";
import {
  PublicationMainFocus,
  useActiveProfile,
  useExploreProfiles,
  useExplorePublications,
} from "@lens-protocol/react-web";
import Image from "next/image";

const Explore = () => {
  const {} = useActiveProfile();
  const {
    data: publications,
    loading,
    hasMore,
    next,
  } = useExplorePublications({
    limit: 10,
    metadataFilter: {
      restrictPublicationMainFocusTo: PublicationMainFocus.Video,
    },
  });

  useEffect(() => {
    console.log(publications);
  }, [loading]);

  return (
    <div className="w-screen">
      <div className="flex mx-10 mt-10">
        <div className="w-full">
          <div className="grid grid-flow-rows grid-cols-4 gap-x-11 gap-y-10">
            {/* {publications &&
              publications.map((publication) => {
                return (
                  <ul className="border border-black">
                    <Image
                      src={`https://ipfs.io/ipfs/${publication.metadata.media[0].original.cover}
                      `}
                      alt="hello"
                      width={120}
                      height={120}
                    />
                  </ul>
                );
              })} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
