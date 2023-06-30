import { ethers } from "ethers";
import { getSigner } from "../utils";
import { splitSignature } from "../utils";
import { refreshAuthToken } from "../pages/api";
import { LENS_HUB_CONTRACT_ADDRESS, LENS_ABI } from "../constants/lenshub";
import { create } from "ipfs-http-client";
import { v4 as uuid } from "uuid";
import { useActiveProfile } from "@lens-protocol/react-web";

import {
  CollectPolicyType,
  ContentFocus,
  ReferencePolicyType,
  useCreatePost,
} from "@lens-protocol/react-web";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// console.log(auth);

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreatePostModal({
  title,
  desc,
  postVideoUrl,
  postVideoCover,
  livepeerLink,
}) {
  /// get the videourl using livepeer
  // const videoUrl = postVideoUrl;
  // const videoUrl =
  //   "ipfs://bafybeihqsfoh7eq3mgp64riz3v2iv2ksp65kxbadb343st4klj5glnt3pe";
  const { data: profile } = useActiveProfile();

  const {
    execute: createPost,
    error,
    isPending,
  } = useCreatePost({
    publisher: profile,
    upload: uploadToIPFS,
  });

  async function uploadToIPFS(data) {
    try {
      // const metaData = {
      //   version: "2.0.0",
      //   content: "first video",
      //   description: "hello",
      //   name: `Post by me`,
      //   external_url: ``,
      //   metadata_id: uuid(),
      //   mainContentFocus: PublicationMainFocus.VIDEO,
      //   attributes: [],
      //   locale: "en-US",
      //   media: "https://ipfs.io/ipfs/bafybeihqsfoh7eq3mgp64riz3v2iv2ksp65kxbadb343st4klj5glnt3pe",
      //   appId: 'Atlas.tv'
      // };

      // description and Media issue , external URL

      const metadata = {
        ...data,
        description: desc,
        external_url: livepeerLink,
      };

      const added = await client.add(JSON.stringify(metadata));
      console.log(metadata);
      const uri = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(uri);
      return uri;
    } catch (error) {
      console.log(error);
    }
  }

  async function savePost() {
    const contentURI = await uploadToIPFS();
    const { accessToken } = await refreshAuthToken();
    console.log(accessToken);
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

  // Metadata Std : https://docs.lens.xyz/docs/metadata-standards#metadata-structure
  async function postWithHook() {
    // {
    //   mimeType: "video/mp4",
    //   url: "ipfs://bafybeihqsfoh7eq3mgp64riz3v2iv2ksp65kxbadb343st4klj5glnt3pe",
    //   altTag: "Atlas Video",
    //   cover:
    //     "ipfs://bafybeigdm4lxpdir3dn5gngzzltachvpkr6tf2utkm6lohexcw46fr4q6e",
    // },
    await createPost({
      content: title,
      media: [
        {
          mimeType: "video/mp4",
          url: postVideoUrl,
          altTag: "Atlas Video",
          cover: postVideoCover,
        },
      ],
      contentFocus: ContentFocus.VIDEO,
      locale: "en",
      collect: {
        type: CollectPolicyType.NO_COLLECT,
      },
      reference: {
        type: ReferencePolicyType.ANYONE,
      },
    });
  }

  return (
    <div className="w-5/6 flex justify-center mx-auto mt-6">
      <button
        className="bg-white text-green-500 font-semibold text-xl border border-green-500 rounded-lg px-10 py-2 hover:scale-105 hover:bg-green-500 hover:text-white duration-200 "
        onClick={postWithHook}
      >
        Post
      </button>
    </div>
  );
}
