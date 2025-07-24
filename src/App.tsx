import React, {useEffect, useMemo, useState} from 'react'
import {useCreateWallet, useLogin, useLogout, usePrivy, useSignAuthorization, useWallets} from "@privy-io/react-auth";
import {createPublicClient, createWalletClient, custom, EIP1193Provider, Hex, http} from "viem";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";
import {celo} from "viem/chains";
import {createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient} from "@zerodev/sdk";
import {signerToEcdsaValidator} from "@zerodev/ecdsa-validator";
import {getEntryPoint, KERNEL_V3_3} from "@zerodev/sdk/constants";
import {KernelVersionToAddressesMap} from "@zerodev/sdk/constants";
import HomePage from './components/HomePage';
import SetupRecoveryPage from './pages/CreateWalletPage';
import RecoverPage from './pages/RecoverPage';
import {encodeFunctionData, formatUnits, parseUnits} from "viem";
import {useClientContext} from "./context/ClientContext.tsx";
import {privateKeyToAccount} from "viem/accounts";

export type EmbeddedWallet = {
  address: `0x${string}`;
  user: string;
};

function App() {
  const {userAddress, setUserAddress, eip1193Provider, setEip1193Provider} = useClientContext();

  const {ready, authenticated, user} = usePrivy();
  const {createWallet} = useCreateWallet();
  const {signAuthorization} = useSignAuthorization();
  const {wallets, ready: walletsReady} = useWallets();
  const {logout} = useLogout();

  /**
   * Creates a public client for blockchain interactions
   * The configured public client or null if wallet client is not available
   */
  const celoTestnetPublicClient = createPublicClient({
    chain: celo,
    transport: http(),
  });
  // /**
  //  * Creates a paymaster client for handling gas payments
  //  * The configured paymaster client or null if public client is not available
  //  */

  const celoTestnetPaymasterClient = useMemo(() => {
    if (!celoTestnetPublicClient) return null;
    return createZeroDevPaymasterClient({
      chain: celo,
      transport: http(),
    });
  }, [celoTestnetPublicClient]);

  useEffect(() => {
    if (!walletsReady || wallets.length === 0) return;


    if (wallets.length > 0) {
      console.log("Privy wallets changed")
      const wallet = wallets[0];
      console.log("Setting user active address to ", wallet.address)
      setUserAddress(wallet.address);
      wallet.getEthereumProvider().then(provider => {
        console.log("Setting provider to ", provider);
        setEip1193Provider(provider as any);
      })
    }
  }, [wallets, walletsReady]);

  const {login} = useLogin({
    onComplete: ({user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount}) => {
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

  // Debug logging
  console.log('App state:', {authenticated, userAddress, ready});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage {...authProps} />}/>
        <Route path="/setuprecovery" element={<SetupRecoveryPage {...authProps} />}/>
        <Route path="/recover" element={<RecoverPage {...authProps} />}/>
      </Routes>
    </Router>
  );
}

export default App;
