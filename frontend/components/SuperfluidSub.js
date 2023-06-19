import { WagmiConfig } from "wagmi";
import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { wagmiConfig } from "./wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function AtlasSubscriptionComponent() {
  return (
    <div>
      <WagmiConfig config={wagmiConfig}>
        <ConnectButton.Custom>
          {({ openConnectModal, connectModalOpen }) => {
            const walletManager = {
              open: async () => openConnectModal(),
              isOpen: connectModalOpen,
            };
            return (
              <SuperfluidWidget
                // {...data}
                tokenList={superTokenList}
                type="dialog"
                walletManager={walletManager}
              >
                {({ openModal }) => (
                  <button onClick={() => openModal()}>
                    Open Superfluid Widget
                  </button>
                )}
              </SuperfluidWidget>
            );
          }}
        </ConnectButton.Custom>
      </WagmiConfig>
    </div>
  );
}
