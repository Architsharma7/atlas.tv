"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { client, challenge, authenticate } from "../components/lens";
import { useRouter } from "next/router";
import {
  useActiveWallet,
  useWalletLogin,
  useWalletLogout,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const router = useRouter();
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
  const { data: wallet, loading } = useActiveWallet();

  const { execute: logout, isPending } = useWalletLogout();

  // const [address, setAddress] = useState();

  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
      router.push("/onboard");
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
                    <p className="text-2xl mt-2">Fully Gated</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Only users who have started the stream are allowed to view
                      the exclusive content of the creators
                    </p>
                  </div>
                  <div className="border-4 border-green-500 rounded-xl flex flex-col items-center px-3">
                    <p className="text-2xl mt-2">Creators Benefit</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Content creators gets all the benefit of the stream with
                      0% platform fees through SuperFluid streams
                    </p>
                  </div>
                  <div className="border-4 border-green-500 rounded-xl flex flex-col items-center px-3">
                    <p className="text-2xl mt-2">On demand Content</p>
                    <p className="mt-4 mb-3 text-xl justify-start">
                      Users get the best content and can support their favourite
                      content creators on our platform
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
                    {!address ? (
                      <div className="flex justify-center items-center mt-5">
                        <ConnectButton />
                      </div>
                    ) : (
                      <>
                        {wallet ? (
                          <>
                            <p className="flex justify-center mt-3">
                              Logged In
                            </p>
                            <button
                              onClick={logout}
                              className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 text-black flex items-center w-full mt-10 hover:scale-110 hover:bg-green-400 hover:text-white duration-200 hover:border-green-500"
                            >
                              Sign Out
                            </button>
                            <button
                              onClick={() => {
                                router.push("/onboard");
                              }}
                              className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 text-black flex items-center w-full mt-10 hover:scale-110 hover:bg-green-400 hover:text-white duration-200 hover:border-green-500"
                            >
                              Sign Up
                            </button>
                          </>
                        ) : (
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
                      </>
                    )}
                    {/* {address && (
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
                    )} */}
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
