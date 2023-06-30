import React, { useEffect, useState } from "react";
import {
  PublicationMainFocus,
  useActiveProfile,
  useExploreProfiles,
  useExplorePublications,
} from "@lens-protocol/react-web";
import Image from "next/image";

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

  return (
    <div className="w-screen">
      <div className="flex mx-10 mt-10">
        <div className="w-full">
          <div className="grid grid-flow-rows grid-cols-4 gap-x-11 gap-y-10">
            {allPublications ? (
              allPublications.map((publication) => {
                return (
                  <ul className="border border-black">
                    {publication.metadata.media[0]?.original && (
                      <Image
                        src={publication.metadata.media[0].original.cover.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )}
                        alt="hello"
                        width={120}
                        height={120}
                      />
                    )}
                  </ul>
                );
              })
            ) : (
              <p>No Videos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

// {publication.metadata.media[0].original.cover}
