import { React, useState, useCallback, createRef } from "react";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
import { useActiveProfile } from "@lens-protocol/react-web";
import { Web3Storage } from "web3.storage";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAccount } from '@wagmi/core'

function getAccessToken() {
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

const CreatorOnboard = () => {
  const { data } = useActiveProfile();

  const [userProfile, setUserProfile] = useState({
    channelName: "",
    channelDescription: "",
    emailId: "",
    userName: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploaded, setUploaded] = useState(false)

  async function storeFiles(image) {
    const client = makeStorageClient();
    const cid = await client.put([image], {
      wrapWithDirectory: false,
    });
    console.log("stored files with cid:", cid);
    setProfileImageUrl(cid);
    setUploaded(true)
  }

  const router = useRouter();

  const account = getAccount();

  const createCreatorRecord = async () => {
    db.signer(async (data) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];

      const sig = await eth.sign(data, account);

      return { h: "eth-personal-sign", sig };
    });

    await db.collection("CreatorProfile").create([data.id, data.handle, account.address]);

    console.log(userProfile);
    console.log(data.handle);
    console.log(data.id);
    console.log(userProfile.channelDescription);

    createChannelData();
    createCreatorViewMetric();

    router.push("/studio");
  };

  const createChannelData = async () => {
    db.signer(async (data) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];

      const sig = await eth.sign(data, account);

      return { h: "eth-personal-sign", sig };
    });

    await db
      .collection("CreatorProfile")
      .record(data.id)
      .call("setCreatorAbout", [
        userProfile.channelDescription,
        userProfile.channelName,
        profileImageUrl,
        userProfile.emailId,
        userProfile.userName,
      ]);
  };

  const createCreatorViewMetric = async() => {
    db.signer(async (data) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];

      const sig = await eth.sign(data, account);

      return { h: "eth-personal-sign", sig };
    });

    await  db.collection("ViewMetrics").create([data.id]);
  }

  const fileInputRef = createRef();

  return (
    <div>
      <div className="flex w-screen">
        <div className="w-3/4 flex justify-center mx-auto">
          <div className="mt-10 flex flex-col items-center">
            <div>
              <p className="text-5xl text-black font-semibold">
                Join Atlas.tv as a Creator
              </p>
            </div>
            <div className="mt-10">
              <p className="text-2xl text-black font-semibold">
                Tell us about Yourself
              </p>
            </div>
            <div className="mt-10">
              <div className="flex w-full justify-between align-middle">
                <div className="flex flex-col">
                  <div className="mt-2">
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="text-sm w-20 h-20 rounded-full border border-black flex items-center mx-10 cursor-pointer"
                    >
                      {profileImageUrl ? (
                        // <img
                        //   src={URL.createObjectURL(profileImageUrl)}
                        //   alt="img"
                        //   width={100}
                        //   height={120}
                        //   className="rounded-full w-full h-full"
                        // />
                        <p className="text-center items-center">image(0)</p>
                      ) : (
                        <p className="flex items-center mx-auto">select</p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setProfileImageUrl(e.target.files[0])}
                      hidden
                    />
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        storeFiles(profileImageUrl)
                      }
                      className={`flex items-center mx-auto mt-2 border border-white bg-green-500 px-6 py-1 rounded-xl text-white`}
                    >
                      {uploaded ? "uploaded" : "upload"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mx-10">
                  <div>
                    <p className="text-xl">Name</p>
                    <input
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userName: e.target.value,
                        })
                      }
                      className="bg-white border border-black px-4 py-1 rounded-lg mt-2 text-black w-full"
                    ></input>
                  </div>
                  <div className="mt-5">
                    <p className="text-xl">Email</p>
                    <input
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          emailId: e.target.value,
                        })
                      }
                      className="bg-white border border-black px-4 py-1 rounded-lg mt-2 text-black w-full"
                    ></input>
                  </div>
                  <div className="mt-5">
                    <p className="text-xl">Channel Name</p>
                    <input
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          channelName: e.target.value,
                        })
                      }
                      className="bg-white border border-black px-4 py-1 rounded-lg mt-2 text-black w-full"
                    ></input>
                  </div>
                  <div className="mt-5">
                    <p className="text-xl">Channel Description</p>
                    <textarea
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          channelDescription: e.target.value,
                        })
                      }
                      className="bg-white border border-black px-4 py-1 rounded-lg mt-2 text-black w-full h-40"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={createCreatorRecord}
              disabled={profileImageUrl == "" ? true : false}
              className={`bg-white text-green-500 border border-green-500 px-10 py-2 mt-10 rounded-xl font-semibold text-xl hover:scale-105 hover:bg-green-500 hover:text-white duration-200`}
            >
              Create Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboard;
