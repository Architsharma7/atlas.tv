"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { client, challenge, authenticate } from "../components/lens";
import { useRouter } from "next/router";
import { useWalletLogin } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect, fetchSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Home() {
  // const router = useRouter();
  // const [address, setAddress] = useState();
  // const [token, setToken] = useState();
  // useEffect(() => {
  //   checkConnection();
  // }, []);
  // async function checkConnection() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const accounts = await provider.listAccounts();
  //   if (accounts.length) {
  //     setAddress(accounts[0]);
  //   }
  // }
  // async function connect() {
  //   const account = await window.ethereum.send("eth_requestAccounts");
  //   if (account.result.length) {
  //     setAddress(account.result[0]);
  //   }
  // }
  // async function login() {
  //   try {
  //     const challengeInfo = await client.query({
  //       query: challenge,
  //       variables: { address },
  //     });
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const signature = await signer.signMessage(
  //       challengeInfo.data.challenge.text
  //     );
  //     const authData = await client.mutate({
  //       mutation: authenticate,
  //       variables: {
  //         address,
  //         signature,
  //       },
  //     });
  //     const {
  //       data: {
  //         authenticate: { accessToken },
  //       },
  //     } = authData;
  //     console.log({ accessToken });
  //     setToken(accessToken);
  //     {accessToken &&
  //     router.push("/onboard")
  //     }
  //   } catch (err) {
  //     console.log("Error signing in: ", err);
  //   }
  // }

  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const [address, setAddress] = useState();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  async function connect() {
    const account = await window.ethereum.send("eth_requestAccounts");
    if (account.result.length) {
      setAddress(account.result[0]);
    }
  }

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      // const walletClient = await connector.getSigner();
      await login({
        address: ((await connector.getSigner()).getAddress())
      });
    }
  };

  return (
    <div>
      <div className="w-screen">
        <div className="mx-10 mt-10 pb-5 rounded-2xl bg-hero">
          <div className="flex md:flex-row flex-col">
            <div className="w-2/3 flex flex-col md:justify-start justify-normal mx-20 mt-20 font-semibold">
              <p className="text-6xl">
                A Closed source{" "}
                <span className="text-green-500">Stream Subscriptions</span>{" "}
                based
              </p>
              <p className="text-6xl mt-2">
                on-demand{" "}
                <span className="text-green-500">Video Streaming</span> service
                provider
              </p>
              <div className="w-full mt-20">
                <div className="grid grid-flow-col grid-cols-3 grid-rows-1 gap-x-5">
                  <div className="border-4 border-green-500 rounded-xl flex flex-col items-center px-3">
                    <p className="text-2xl mt-2">hello</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quae nemo natus itaque facilis dolor, neque provident
                      doloremque sequi ipsam omnis quasi impedit iure facere.
                      Pariatur cupiditate odio error debitis nesciunt.
                    </p>
                  </div>
                  <div className="border-4 border-green-500 rounded-xl flex flex-col items-center px-3">
                    <p className="text-2xl mt-2">hello</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quae nemo natus itaque facilis dolor, neque provident
                      doloremque sequi ipsam omnis quasi impedit iure facere.
                      Pariatur cupiditate odio error debitis nesciunt.
                    </p>
                  </div>
                  <div className="border-4 border-green-500 rounded-xl flex flex-col items-center px-3">
                    <p className="text-2xl mt-2">hello</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quae nemo natus itaque facilis dolor, neque provident
                      doloremque sequi ipsam omnis quasi impedit iure facere.
                      Pariatur cupiditate odio error debitis nesciunt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3 md:justify-end justify-normal">
              <div className="flex flex-col items-center justify-center md:h-screen h-auto md:my-auto my-0 mx-10">
                <div className="bg-white shadow rounded w-full p-10">
                  <p className="text-2xl font-extrabold leading-6 text-black">
                    Start on Atlas.Tv
                  </p>
                  <p className="text-green-600 mt-10 text-xl font-semibold leading-relaxed">
                    Start creating video content on Atlas.tv and get paid with
                    every view you get, or start watching content of your
                    favourite creators with a single click.
                  </p>
                  <div>
                    {!address && (
                      <button
                        onClick={connect}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 text-black flex items-center w-full mt-10 hover:scale-110 hover:bg-green-400 hover:text-white duration-200 hover:border-green-500"
                      >
                        <p className="text-3xl">🌿</p>
                        <p className="text-base font-semibold text-center ml-4 text-gray-700">
                          Connect Wallet
                        </p>
                      </button>
                    )}
                    {address && (
                      <button
                        disabled={isLoginPending}
                        onClick={onLoginClick}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 text-black flex items-center w-full mt-10 hover:scale-110 hover:bg-green-400 hover:text-white duration-200 hover:border-green-500"
                      >
                        <p className="text-3xl">🌿</p>
                        <p className="text-base font-semibold text-center ml-4 text-gray-700">
                          Login with Lens
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div>
      {!address && <button onClick={connect}>Connect</button>}
      {address && !token && (
        <div onClick={login}>
          <button>Login</button>
        </div>
      )}
      {address && token && <h2>Successfully signed in!</h2>}
    </div> */
}
