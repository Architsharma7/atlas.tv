import { React, useState } from "react";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
import { useActiveProfile } from "@lens-protocol/react-web";

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

const UserOnboard = () => {
  const { data, error, loading } = useActiveProfile();
  const lensId = data.id;
  const lensUserName = data.handle;

  const [userProfile, setUserProfile] = useState({
    userName: "",
    emailId: "",
  });

  const createUserRecord = async () => {
    db.signer(async (data) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];

      const sig = await eth.sign(data, account);

      return { h: "eth-personal-sign", sig };
    });

    await db.collection("UserProfile").create([lensId, lensUserName]);

    await db
      .collection("UserProfile")
      .record(lensId)
      .call("setUserAbout", [
        userProfile.userName,
        userProfile.emailId,
      ]);
    console.log(userProfile);
    console.log(data.handle);
    console.log(data.id);
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
        <button onClick={createUserRecord}>create</button>
      </div>
    </div>
  );
};

export default UserOnboard;
