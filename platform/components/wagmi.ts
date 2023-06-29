import { configureChains, createClient } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { chains, provider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const projectId = "84ac6c94812e6453ba180e053d640ea3";

const { wallets, connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { wagmiClient, chains };
