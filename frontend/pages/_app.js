import "@rainbow-me/rainbowkit/styles.css";
import {
  wagmiConfig,
  WagmiConfig,
  RainbowKitProvider,
  chains,
} from "../components/wagmi";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { LensProvider } from '@lens-protocol/react-web';
// import { LensProvider } from "@lens-protocol/react-web";
// import { LensConfig, development } from '@lens-protocol/react-web';
// import { bindings as wagmiBindings } from '@lens-protocol/wagmi';

// const lensConfig = {
//   bindings: wagmiBindings(),
//   environment: development,
// };

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "87a6417d-254e-416c-9dbe-f2acacabb78f",
  }),
});

export default function App({ Component, pageProps }) {
  return (
    // <LensProvider  config={lensConfig}>
    <LivepeerConfig client={livepeerClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </LivepeerConfig>
    // </LensProvider>
  );
}
