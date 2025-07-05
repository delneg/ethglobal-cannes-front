import React, {useEffect, useMemo, useState} from 'react'
import {useCreateWallet, useLogin, useLogout, usePrivy, useSignAuthorization, useWallets} from "@privy-io/react-auth";
import {createPublicClient, createWalletClient, custom, EIP1193Provider, Hex, http} from "viem";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";
import { celoAlfajores} from "viem/chains";
import {createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient} from "@zerodev/sdk";
import {signerToEcdsaValidator} from "@zerodev/ecdsa-validator";
import {getEntryPoint, KERNEL_V3_3} from "@zerodev/sdk/constants";
import {KernelVersionToAddressesMap} from "@zerodev/sdk/constants";
import HomePage from './components/HomePage';
import SetupRecoveryPage from './pages/CreateWalletPage';
import RecoverPage from './pages/RecoverPage';
import {encodeFunctionData, formatUnits, parseUnits} from "viem";

export type EmbeddedWallet = {
  address: `0x${string}`;
  user: string;
};
const PROJECT_ID = "5d90c0c9-6051-427b-b804-d4dac215b98c"
export const celoAlfajoresBundlerRpc = `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/44787`;
export const celoAlfajoresPaymasterRpc = `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/44787`;

export const entryPoint = getEntryPoint("0.7");
export const kernelVersion = KERNEL_V3_3;
export const kernelAddresses = KernelVersionToAddressesMap[kernelVersion];
export const ZERODEV_TOKEN_ADDRESS = "0xB763277E5139fB8Ac694Fb9ef14489ec5092750c";
export const ZERODEV_DECIMALS = 6;
export const EXPLORER_URL = celoAlfajores.blockExplorers.default.url;

function App() {

  const [userAddress, setUserAddress] = useState<string | undefined | `0x${string}`>(undefined);
  const [eip1193Provider, setEip1193Provider] = useState<EIP1193Provider | undefined>(undefined);

  const {ready, authenticated, user} = usePrivy();
  const {createWallet} = useCreateWallet();
  const {signAuthorization} = useSignAuthorization();
  const {wallets, ready: walletsReady} = useWallets();
  const { logout } = useLogout();



  // useEffect(() => {


  const privyEmbeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy");
  }, [wallets]);

  /**
   * Creates a wallet client using the embedded wallet's ethereum provider
   * The configured wallet client or null if not available
   */
  const {data: privyAccount} = useQuery({
    queryKey: ["walletClient", privyEmbeddedWallet?.address],
    queryFn: async () => {
      if (!privyEmbeddedWallet) {
        return null;
      }
      const walletClient = createWalletClient({
        account: privyEmbeddedWallet.address as Hex,
        chain: celoAlfajores,
        transport: custom(await privyEmbeddedWallet.getEthereumProvider()),
      });
      return walletClient;
    },
    enabled: !!privyEmbeddedWallet,
  });


  // const baseSepoliaPublicClient = createPublicClient({
  //   chain: ,
  //   transport: http(),
  // });
  /**
   * Creates a public client for blockchain interactions
   * The configured public client or null if wallet client is not available
   */
  const celoTestnetPublicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
  // /**
  //  * Creates a paymaster client for handling gas payments
  //  * The configured paymaster client or null if public client is not available
  //  */

  const celoTestnetPaymasterClient = useMemo(() => {
    if (!celoTestnetPublicClient) return null;
    return createZeroDevPaymasterClient({
      chain: celoAlfajores,
      transport: http(celoAlfajoresPaymasterRpc),
    });
  }, [celoTestnetPublicClient]);

  /**
   * Creates an ECDSA validator for the kernel account
   * The configured validator or null if prerequisites are not met
   */
  const {data: kernelClients} = useQuery({
    queryKey: [
      "kernelClient",
      privyAccount?.account.address,
      celoTestnetPaymasterClient?.name,
    ],
    queryFn: async () => {
      if (!privyAccount || !celoTestnetPublicClient || !celoTestnetPaymasterClient) return null;

      const ecdsaValidator = await signerToEcdsaValidator(celoTestnetPublicClient, {
        signer: privyAccount,
        entryPoint,
        kernelVersion,
      });

      const authorization = await signAuthorization({
        contractAddress: kernelAddresses.accountImplementationAddress,
        chainId: celoAlfajores.id,
      });

      const kernelAccount = await createKernelAccount(celoTestnetPublicClient, {
        eip7702Account: privyAccount,
        entryPoint,
        kernelVersion,
        eip7702Auth: authorization,
      });

      const kernelAccountClient = createKernelAccountClient({
        account: kernelAccount,
        chain: celoAlfajores,
        bundlerTransport: http(celoAlfajoresBundlerRpc),
        paymaster: celoTestnetPaymasterClient,
        client: celoTestnetPublicClient,
      });

      return {kernelAccountClient, kernelAccount, ecdsaValidator};
    },
    enabled: !!celoTestnetPublicClient && !!privyAccount && !!celoTestnetPaymasterClient,
  });


  useEffect(() => {
    console.log('kernel clients changed', kernelClients);
  }, [kernelClients]);
  const {mutate: createEmbeddedWallet} = useMutation({
    mutationFn: async () => {
      const newEmbeddedWallet = await createWallet();
      return newEmbeddedWallet;
    },
  });


    useEffect(() => {
      if (user) {
        if (!privyEmbeddedWallet) {
          createEmbeddedWallet();
        }
      }
    }, [user, privyEmbeddedWallet, createEmbeddedWallet]);

    const {data: embeddedWallet} = useQuery<EmbeddedWallet | null>({
      queryKey: ["embeddedWallet", privyEmbeddedWallet?.address, user],
      queryFn: async () => {
        if (!user) return null;
        if (!privyEmbeddedWallet) return null;

        return {
          address: privyEmbeddedWallet.address as `0x${string}`,
          user: user.email?.address ?? user.id,
        };
      },
      enabled: !!privyEmbeddedWallet && !!user,
    });

    useEffect(() => {
      console.log('embedded wallet changed', embeddedWallet);
    }, [embeddedWallet]);
  //
  //   if (!walletsReady || wallets.length === 0) return;
  //
  //
  //   if (wallets.length > 0) {
  //     console.log("Privy wallets changed")
  //     const wallet = wallets[0];
  //     console.log("Setting user active address to ", wallet.address)
  //     setUserAddress(wallet.address);
  //     wallet.getEthereumProvider().then(provider => {
  //       console.log("Setting provider to ", provider);
  //       setEip1193Provider(provider as any);
  //     })
  //   }
  // }, [wallets, walletsReady]);


  const {
    mutate: sendTransaction,
    isPending,
    data: txHash,
  } = useMutation({
    mutationKey: ["gasSponsorship sendTransaction", kernelClients?.kernelAccountClient?.account?.address],
    mutationFn: async () => {
      if (!kernelClients?.kernelAccountClient?.account) throw new Error("No kernel client found");

      const kernelAccountClient = kernelClients?.kernelAccountClient;
      return kernelAccountClient.sendTransaction({
        account: kernelAccountClient.account,
        to: "0x406F912c5a5B6137Be1153ec71DD9c03624FF3E6",
        value: BigInt(0),
        data: encodeFunctionData({
          abi: [
            {
              name: "setScope",
              type: "function",
              inputs: [
                {name: "_scope", type: "uint256"},
              ],
            },
          ],
          functionName: "setScope",
          args: ["14083505874396192783076663245664044579645088232806584587291798726989971910781"],
        }),
        chain: celoAlfajores,
      });
    },
    onSuccess: (data) => {
      console.log(data);
      console.log("Transaction sent successfully");
    },
    onError: (error) => {
      console.error(error);
      console.log("Failed to send transaction");
    },
  });

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

  // Debug logging
  console.log('App state:', { authenticated, userAddress, ready });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage {...authProps} />} />
        <Route path="/setuprecovery" element={<SetupRecoveryPage {...authProps} />} />
        <Route path="/recover" element={<RecoverPage {...authProps} />} />
      </Routes>
    </Router>
  );
}

export default App;
