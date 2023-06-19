import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  wagmiConfig,
  WagmiConfig,
  RainbowKitProvider,
  chains,
} from "../components/wagmi";

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
