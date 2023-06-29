import { React, useState } from "react";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
import { useActiveProfile } from "@lens-protocol/react-web";

const db = new Polybase({
  defaultNamespace:
    "pk/0xdd6503afa34792ca49abce644c46527bc2f664299797958e7780d21b4713a9698d35124fa269561f078f89c4aea969a862a20021f3f4042e1d5e5803817e28d3/atlas.tv",
});

const UserOnboard = () => {
  const { data, loading } = useActiveProfile();

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

    await db.collection("UserProfile").create([data.id, data.handle]);

    await db
      .collection("UserProfile")
      .record(data.id)
      .call("setUserAbout", [userProfile.userName, userProfile.emailId]);
    console.log(userProfile);
    console.log(data.handle);
    console.log(data.id);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex w-screen">
          <div className="w-3/4 flex justify-center mx-auto">
            <div className="mt-10 flex flex-col items-center">
              <div>
                <p className="text-5xl text-black font-semibold">
                  Vibe at Atlas.tv
                </p>
              </div>
              <div className="mt-10">
                <p className="text-2xl text-black font-semibold">
                  Tell us about Yourself
                </p>
              </div>
              <div className="mt-10">
                <div className="flex flex-col">
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
                  <button
                    onClick={createUserRecord}
                    className={`bg-white text-green-500 border border-green-500 px-10 py-2 mt-10 rounded-xl font-semibold text-xl hover:scale-105 hover:bg-green-500 hover:text-white duration-200`}
                  >
                    Let's start
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboard;
