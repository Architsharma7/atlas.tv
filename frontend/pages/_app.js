import "@rainbow-me/rainbowkit/styles.css";
import {
  wagmiConfig,
  WagmiConfig,
  RainbowKitProvider,
  chains,
} from "../components/wagmi";
import { LensProvider } from "@lens-protocol/react-web";
// import { LensConfig, development } from '@lens-protocol/react-web';
// import { bindings as wagmiBindings } from '@lens-protocol/wagmi';

// const lensConfig = {
//   bindings: wagmiBindings(),
//   environment: development,
// };

export default function App({ Component, pageProps }) {
  return (
    // <LensProvider  config={lensConfig}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    // </LensProvider>
  );
}
