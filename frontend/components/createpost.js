import { ethers } from "ethers";
import { getSigner } from "../utils";
import { splitSignature } from "../utils";
import { refreshAuthToken } from "../pages/api";
import { LENS_HUB_CONTRACT_ADDRESS, LENS_ABI } from "../constants/lenshub";
import { create } from "ipfs-http-client";
import { v4 as uuid } from "uuid";
import { useRef } from "react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET
const auth =  'Basic '+ Buffer.from(projectId+ ':' + projectSecret).toString('base64');

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreatePostModal() {
  /// get the videourl using livepeer
  const videoUrl = ""
  const inputRef = useRef(null);
  async function uploadToIPFS() {
    const metaData = {
      version: "2.0.0",
      content: "hello",
      description: "bye",
      name: `Post by me`,
      external_url: ``,
      metadata_id: uuid(),
      mainContentFocus: "VIDEO",
      attributes: [],
      locale: "en-US",
      media : videoUrl
    };

    const added = await client.add(JSON.stringify(metaData));
    const uri = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(uri);
    return uri;
  }

  async function savePost() {
    const contentURI = await uploadToIPFS();
    const { accessToken } = await refreshAuthToken();
    const createPostRequest = {
      profileId: profile.id,
      contentURI,
      collectModule: {
        // any collect module
        freeCollectModule: { followerOnly: true },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    try {
      const signedResult = await signCreatePostTypedData(
        createPostRequest,
        accessToken
      );
      const typedData = signedResult.result.typedData;
      const { v, r, s } = splitSignature(signedResult.signature);

      const contract = new ethers.Contract(
        LENS_HUB_CONTRACT_ADDRESS,
        LENS_ABI,
        getSigner()
      );

      const tx = await contract.postWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });

      await tx.wait();
      console.log("successfully created post: tx hash", tx.hash);
      setIsModalOpen(false);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <div>
      <button onClick={savePost}>post</button>
    </div>
  );
}
