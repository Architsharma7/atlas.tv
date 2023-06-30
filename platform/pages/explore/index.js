import React, { useEffect, useState } from "react";
import {
  PublicationMainFocus,
  useActiveProfile,
  useExploreProfiles,
  useExplorePublications,
} from "@lens-protocol/react-web";
import Image from "next/image";
import { useRouter } from "next/router";

const Explore = () => {
  const [allPublications, setAllPublications] = useState();
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
    if (publications != undefined) {
      setAllPublications(publications);
    }
  }, [loading]);

  const router = useRouter();

  return (
    <div className="w-screen">
      <div className="flex mx-10 mt-10">
        <div className="w-full">
          <div className="grid grid-flow-rows grid-cols-4 gap-x-11 gap-y-10">
            {publications &&
              publications.map((publication) => {
                return (
                  <ul className="border border-black rounded-xl h-2/3">
                    <img
                      src={`https://ipfs.io/ipfs/${publication.metadata.media[0].original.cover}
                      `}
                      alt="hello"
                      className="object-fill rounded-xl w-full h-full cursor-pointer"
                      onClick={() => {router.push(`/explore/${[publication.metadata.media[0].original.altTag]}`)}}
                    />
                    <p className="flex justify-center font-semibold text-xl">{publication.metadata.content}</p>
                    <p  className="flex justify-center">by {publication.profile.handle}</p>
                  </ul>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
