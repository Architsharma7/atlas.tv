import React, { useEffect, useState } from "react";
import { CreateAndViewAsset } from "../components/videoupload";
import { useActiveProfile } from "@lens-protocol/react-web";
import { Polybase } from "@polybase/client";
import Image from "next/image";
import CreatePostModal from "../components/post";

const Post = () => {
  const { data: profile, loading } = useActiveProfile();
  // const [userData, setUserData] = useState();

  // useEffect(() => {
  //   getCreatorData();
  // }, []);

  // const getCreatorData = async () => {
  //   const db = new Polybase({
  //     defaultNamespace:
  //       "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
  //   });
  //   const collectionReference = db.collection("CreatorProfile");
  //   // put data.id in place of 20
  //   const records = await collectionReference.where("id", "==", "20").get();
  //   const { data, cursor } = records;
  //   setUserData(data);
  //   {
  //     userData && console.log(userData);
  //   }
  // };

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [postVideoUrl, setPostVideoUrl] = useState();
  const [livepeerLink, setLivepeerLink] = useState();
  const [postVideoCover, setPostVideoCover] = useState();
  return (
    <div>
      <div className="w-screen">
        <div className="flex flex-col">
          {/* <div className="flex flex-row justify-between mt-6 mx-10 align-middle">
            <div>
              <p className="text-xl text-green-500">hello</p>
            </div>
            <div>
              <p>hello</p>
            </div>
          </div> */}
          <div className="mt-10 flex flex-col h-screen">
            <CreateAndViewAsset
              title={title}
              setDesc={setDesc}
              setTitle={setTitle}
              desc={desc}
              postVideoUrl={postVideoUrl}
              setPostVideoUrl={setPostVideoUrl}
              livepeerLink={livepeerLink}
              setLivepeerLink={setLivepeerLink}
              postVideoCover={postVideoCover}
              setPostVideoCover={setPostVideoCover}
            />
            <CreatePostModal
              title={title}
              setDesc={setDesc}
              setTitle={setTitle}
              desc={desc}
              postVideoUrl={postVideoUrl}
              setPostVideoUrl={setPostVideoUrl}
              livepeerLink={livepeerLink}
              setLivepeerLink={setLivepeerLink}
              postVideoCover={postVideoCover}
              setPostVideoCover={setPostVideoCover}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

{
  /* <p> {userData && userData.name}</p>
        {userData && (
          <Image
            src={userData.profileImageUrl}
            width={120}
            height={120}
            className="rounded-xl w-full h-full"
            alt="pfp"
          />
        )} */
}
