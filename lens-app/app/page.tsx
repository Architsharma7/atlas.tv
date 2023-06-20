'use client'
import { useWalletLogin, useWalletLogout, useActiveProfile } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Authentication() {
  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { data: wallet, loading } = useActiveProfile();
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
  }
 
  return (
    <div className="flex flex-col p-12 items-start">
      {
        loading && <p>Loading...</p>
      }
      {
        !wallet && !loading && (
          <button
          className='mt-2 px-6 py-1 bg-white text-black rounded'
            disabled={isLoginPending}
            onClick={onLoginClick}>Sign in</button>
        )
      }
      {
        wallet && !loading && (
          <div>
            <h3 className="text-3xl">{wallet.handle}</h3>
            <p>{wallet.bio}</p>
            <button onClick={logout} className='mt-2 px-6 py-1 bg-white text-black rounded'>Sign out</button>
          </div>
        )
      }
    </div>
  );
}