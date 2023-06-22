import { ethers } from "ethers";
import { getSigner } from "../utils";
import { create } from "ipfs-http-client";
import { v4 as uuid } from "uuid";
import { splitSignature } from "../utils";
import { refreshAuthToken } from "../pages/api";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export default function CreatePostModal() {
    /// get the uri using livepeer
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
      LENSHUB,
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

  return (
    <div>
      hello
      <p>hello</p>
    </div>
  );
}
