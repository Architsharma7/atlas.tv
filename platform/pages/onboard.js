import { React, useState } from "react";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
// import { useActiveProfile } from '@lens-protocol/react-web';
import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

// function getFiles() {
//   const fileInput = document.querySelector('input[type="file"]');
//   return fileInput.files;
// }

async function storeFiles(image) {
  const client = makeStorageClient();
  const cid = await client.put(image);
  console.log("stored files with cid:", cid);
  return cid;
}

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

const Onboard = () => {
  //   const { data, error, loading } = useActiveProfile();
  const lensId = data.id
  const userName = data.handle

  const [userProfile, setUserProfile] = useState({
    channelName: "",
    channelDescription: "",
    emailId: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState();

  const createCreatorRecord = async (
  ) => {
    db.signer(async (data) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];

      const sig = await eth.sign(data, account);

      return { h: "eth-personal-sign", sig };
    });

    await db.collection("CreatorProfile").create([lensId, userName]);

    await db
      .collection("CreatorProfile")
      .record(lensId)
      .call("setAbout", [userProfile.channelDescription, userProfile.channelName, profileImageUrl, userProfile.emailId, userName]);
      // console.log(userProfile)
    // console.log(data.handle)
    // console.log(data.id)
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>name</p>
        <input
          onChange={(e) =>
            setUserProfile({ ...userProfile, userName: e.target.value })
          }
        ></input>
        <p>email</p>
        <input
          onChange={(e) =>
            setUserProfile({ ...userProfile, emailId: e.target.value })
          }
        ></input>
        <p>channelname</p>
        <input
          onChange={(e) =>
            setUserProfile({ ...userProfile, channelName: e.target.value })
          }
        ></input>
        <p>profile image</p>
        <input onChange={(e) => setProfileImageUrl(URL.createObjectURL(e.target.files[0]))} type="file" accept="image/png, image/jpg, image/jpeg"></input>
        <button onClick={() => storeFiles(profileImageUrl)}>upload</button>
        <p>channeldesc</p>
        <input
          onChange={(e) =>
            setUserProfile({
              ...userProfile,
              channelDescription: e.target.value,
            })
          }
        ></input>
        <button onClick={createCreatorRecord}>create</button>
      </div>
    </div>
  );
};

export default Onboard;
