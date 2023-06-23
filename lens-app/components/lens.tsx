import {
  useWalletLogin,
  useActiveWallet,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function HomePage() {
  const { data: wallet } = useActiveWallet();
  const { data, error } = useActiveProfile();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (wallet) {
    return <p>You are logged-in with {wallet.address}</p>;
  }

  return <p>You are logged-out</p>;
}

function LoginButton() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

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
    }
  };

  return (
    <div>
      {loginError && <p>{loginError}</p>}
      <button disabled={isLoginPending} onClick={onLoginClick}>
        Log in
      </button>
    </div>
  );
}
