import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LensProvider } from "@lens-protocol/react-web";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../components/wagmi";
import { lensConfig } from "../components/lens";
import { LivepeerConfig } from "@livepeer/react";
import { livepeerClient } from "../components/livepeer";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LivepeerConfig client={livepeerClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <LensProvider config={lensConfig}>
            <Component {...pageProps} />
          </LensProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </LivepeerConfig>
  );
}
