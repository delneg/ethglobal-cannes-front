import React, {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Address, Chain, createPublicClient, createWalletClient, custom, EIP1193Provider, http, zeroAddress} from 'viem';
import {SelfAppBuilder, SelfQRcodeWrapper} from "@selfxyz/qrcode";
import {
  calculateContractAddress,
  getExplorerUrl,
  IMPLEMENTATION_ADDRESS,
  initializeAccount
} from "../utils/contractStuff.ts";
import {useClientContext} from "../context/ClientContext.tsx";
import {useMutation} from "@tanstack/react-query";
import {getMockedPaymasterWalletClient} from "../utils/mockPaymaster.ts";
import {useSign7702Authorization, useWallets} from "@privy-io/react-auth";
import {celoAlfajores} from "viem/chains";

interface SetupRecoveryPageProps {
  isAuthenticated: boolean;
  user: any;
  userAddress?: string | `0x${string}`;
  onAuth: () => void;
  ready: boolean;
  eip1193Provider?: EIP1193Provider;
}

const SetupRecoveryPage: React.FC<SetupRecoveryPageProps> = ({
  isAuthenticated,
  user,
  userAddress,
  onAuth,
  ready,
  eip1193Provider
}) => {
  const navigate = useNavigate();
  const [recoveryBound, setRecoveryBound] = useState(false);
  const [boundCode, setBoundCode] = useState(false);

  const {contractAddress, setContractAddress} = useClientContext();
  const handleConnectWallet = () => {
    onAuth();
  };
  const {wallets} = useWallets();

  const {signAuthorization} = useSign7702Authorization();

  const createAuthorization = async (userAddress: Address, chain: Chain, implementationAddress: Address) => {
    const publicClient = createPublicClient({
      transport: http(),
      chain: celoAlfajores,
    })
    const userNonce = await publicClient.getTransactionCount({address: userAddress})
    return await signAuthorization({
      contractAddress: implementationAddress,
      chainId: 0,
      nonce: userNonce,
    })
  }

  const bindCodeMutation = useMutation({
    mutationFn: async () => {
      const paymasterWalletClient = getMockedPaymasterWalletClient()

      // // Drop old auth
      // const zeroAuth = await createAuthorization(
      //     userAddress as Address,
      //     celoAlfajores,
      //     zeroAddress
      // )
      // await dropAuth(paymasterWalletClient, userAddress as Address, zeroAuth)
      // console.log('Removing previous 7702 authorization for user', userAddress)

      // Setup new auth and initialize account
      console.log('Initializing account for user', userAddress)
      const auth = await createAuthorization(
          userAddress as Address,
          celoAlfajores,
          IMPLEMENTATION_ADDRESS as Address
      )
      const contractAddress = await calculateContractAddress(userAddress as any)
      console.log('CONTRACT ADDRESS TO USE IN SELF APP: ', contractAddress)
      setContractAddress(contractAddress);

      const acc = await initializeAccount(paymasterWalletClient, userAddress!, auth);
      console.log("Account initialized", getExplorerUrl(acc))
      return acc;
    },
    onSuccess: () => {
      setBoundCode(true);
    },
    onError: (error) => {
      console.error('Error binding code:', error);
    }
  });

  // 0xB367738cc7760fAf9563751De4aE1B16E560c2D5

  const selfApp = useMemo(() => {
    if (!userAddress || userAddress == '') return null;
    if (!contractAddress || contractAddress == '') return null;
    return new SelfAppBuilder({
      appName: "Revix: Wallet Recovery",
      scope: "my-app-dev",
      endpoint: contractAddress,
      endpointType: "staging_celo", // Use testnet
      userId: userAddress,
      userIdType: "hex",
      version: 2,
      userDefinedData: "Attaching your passport to your wallet",
      disclosures: {
        minimumAge: 11,
        nationality: true,
      }
    }).build()
  }, [userAddress, contractAddress]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Main Content */}
      <main className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Setup Recovery
          </h1>
          <p className="text-xl text-gray-600 mt-8">
            Connect your wallet and link your Self Passport for recovery. <br/>Once it will be done, you will be able to recover your wallet using your Self Passport.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Step 1: Connect Wallet */}
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-blue">
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Connect Your Wallet</h2>
            </div>

            <p className="text-gray-600 mb-8">
              Connect your wallet using Privy to get started.
            </p>

            {isAuthenticated && userAddress ? (
              <div className="status-success">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontWeight: '500' }}>Wallet connected: {userAddress}</span>
              </div>
            ) : isAuthenticated && !userAddress ? (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Loading wallet address...
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="btn-primary"
                disabled={!ready}
                style={{ opacity: ready ? 1 : 0.6 }}
              >
                {!ready ? 'Loading...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Step 2: Link Self Passport */}
          {isAuthenticated && userAddress && !recoveryBound &&
              <div className="card" style={{ opacity: !isAuthenticated ? 0.5 : 1 }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="icon-container icon-purple">
                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Link Self Passport</h2>
                </div>

                <p className="text-gray-600 mb-8">
                  Fund your account with some Celo to cover gas fees. Gas sponsorship is coming soon.<br/> After that, open Self App and scan the QR code below.
                </p>

                {!boundCode ? (
                  <div>
                    <button
                      onClick={() => bindCodeMutation.mutate()}
                      disabled={!isAuthenticated || bindCodeMutation.isPending}
                      className="btn-primary"
                      style={{
                        opacity: (!isAuthenticated || bindCodeMutation.isPending) ? 0.5 : 1,
                        cursor: (!isAuthenticated || bindCodeMutation.isPending) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {bindCodeMutation.isPending ? 'Loading...' : 'Initialize Account & Attach Passport'}
                    </button>
                    {bindCodeMutation.isError && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        marginTop: '8px',
                        textAlign: 'center'
                      }}>
                        Failed to initialize. Please try again.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <SelfQRcodeWrapper
                      selfApp={selfApp!}
                      onSuccess={() => {
                        console.log('Verification successful');
                        // Perform actions after successful verification
                        setRecoveryBound(true);
                      }}
                      onError={(err) => console.log(err)}
                    />
                    <p style={{ color: '#4b5563', fontSize: '14px' }}>
                      Scan this code using your Self App to authorize this device for recovery.
                    </p>
                  </div>
                )}

              </div>
          }

          {/* Final Step: Success */}
          {recoveryBound && (
            <div className="card text-center" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '24px' }}>🎉</div>
              <h2 className="text-3xl text-gray-400 font-bold  mb-4">You're ready!</h2>
              <p style={{ color: '#4b5563', marginBottom: '32px' }}>
                Your wallet has been successfully created and configured for recovery.
              </p>
              <button
                onClick={() => navigate('/recover')}
                className="btn-primary"
                style={{ fontSize: '18px' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Test Recovery
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SetupRecoveryPage;
