import React, { useEffect } from "react";
import { usePublications } from "@lens-protocol/react-web";

const Explore = () => {
  const { data: publications, loading, hasMore, next } = usePublications();
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
