import React, { useEffect } from "react";
import {
  PublicationMainFocus,
  useActiveProfile,
  useExplorePublications,
} from "@lens-protocol/react-web";

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
    <div>
      <p>Hello</p>
    </div>
  );
};

export default Explore;
