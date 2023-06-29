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
    metadataFilter: {
      restrictPublicationMainFocusTo: PublicationMainFocus.TextOnly,
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
