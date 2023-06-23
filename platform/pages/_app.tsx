import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LensProvider } from "@lens-protocol/react-web";
import { WagmiConfig } from "wagmi";
import { wagmiClient } from "../components/wagmi";
import { lensConfig } from "../components/lens";
import { LivepeerConfig } from "@livepeer/react";
import { livepeerClient } from "../components/livepeer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LivepeerConfig client={livepeerClient}>
      <WagmiConfig client={wagmiClient}>
        <LensProvider config={lensConfig}>
          <Component {...pageProps} />
        </LensProvider>
      </WagmiConfig>
    </LivepeerConfig>
  );
}
