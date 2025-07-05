import React, {useEffect, useState} from 'react'
import {useLogin, usePrivy, useWallets} from "@privy-io/react-auth";
import {EIP1193Provider} from "viem";

function App() {

  const [userAddress, setUserAddress] = useState<string | undefined | `0x${string}`>(undefined);
  const [eip1193Provider, setEip1193Provider] = useState<EIP1193Provider | undefined>(undefined);

  const { ready, authenticated } = usePrivy();



  const {wallets, ready: walletsReady} = useWallets();
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
      console.log("User logged in")
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
    },
    onError: (error) => {
      // TODO: handle privy error
      console.log(error);
    },
  });
  const handleOpenModal = () => {
    if (ready && authenticated) {
      console.log('auth done')
    } else {
      login();
    }
  };
  return (
    <button onClick={handleOpenModal}>login</button>
  );
}

export default App;
