import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLogin, usePrivy, useWallets, useLogout } from "@privy-io/react-auth";
import { EIP1193Provider } from "viem";
import HomePage from './components/HomePage';
import CreateWalletPage from './pages/CreateWalletPage';
import RecoverPage from './pages/RecoverPage';

function App() {
  const [userAddress, setUserAddress] = useState<string | undefined | `0x${string}`>(undefined);
  const [eip1193Provider, setEip1193Provider] = useState<EIP1193Provider | undefined>(undefined);

  const { ready, authenticated, user } = usePrivy();
  const { logout } = useLogout();

  const { wallets, ready: walletsReady } = useWallets();
  useEffect(() => {
    if (!walletsReady || wallets.length === 0) return;

    if (wallets.length > 0) {
      console.log("Privy wallets changed");
      const wallet = wallets[0];
      console.log("Setting user active address to ", wallet.address);
      setUserAddress(wallet.address);
      wallet.getEthereumProvider().then(provider => {
        console.log("Setting provider to ", provider);
        setEip1193Provider(provider as any);
      });
    }
  }, [wallets, walletsReady]);

  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log("User logged in");
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
    },
    onError: (error) => {
      console.log("Privy login error:", error);
    },
  });

  const handleAuth = () => {
    if (ready && authenticated) {
      logout();
    } else {
      login();
    }
  };

  const authProps = {
    isAuthenticated: authenticated,
    user,
    userAddress,
    onAuth: handleAuth,
    ready,
    eip1193Provider
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage {...authProps} />} />
        <Route path="/create" element={<CreateWalletPage {...authProps} />} />
        <Route path="/recover" element={<RecoverPage {...authProps} />} />
      </Routes>
    </Router>
  );
}

export default App;
