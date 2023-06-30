import { WagmiConfig } from "wagmi";
import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { wagmiConfig } from "./wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { paymentDetails } from "../constants/paymentDetails";
import { productDetails } from "../constants/productDetails";

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
                paymentDetails={paymentDetails}
                productDetails={productDetails}
                tokenList={superTokenList}
                type="full-screen"
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

export function AtlasCreatorSubscriptionComponent(props) {
  console.log(props);
  const paymentOptions = [
    {
      chainId: 80001,
      receiverAddress: props.creatorAddress.address,
      superToken: {
        address: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
      },
      flowRate: {
        amountEther: props.flowRate,
        period: "month",
      },
    },
  ];

  const paymentDetails = {
    paymentOptions,
  };

  const productDetails = {
    name: `${props.creatorName} Exclusive Community Subscription`,
    description: `This Subsription grants access to the exclusive community of the creator ${props.creatorName}`,
  };

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
                paymentDetails={paymentDetails}
                productDetails={productDetails}
                tokenList={superTokenList}
                type="full-screen"
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
