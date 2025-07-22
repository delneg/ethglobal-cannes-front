import React, {useEffect, useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {createPublicClient, createWalletClient, EIP1193Provider, http} from 'viem';
import Header from '../components/Header';
import {SelfApp, SelfAppBuilder, SelfQRcodeWrapper} from "@selfxyz/qrcode";
import {useSignMessage} from '@privy-io/react-auth';
import {useClientContext} from "../context/ClientContext.tsx";
import {
  recoverTestTx,
  getExplorerUrl,
  getSmartAccountImplementationAddress,
  initializeRecoveryMode,
  isInitialized
} from "../utils/contractStuff.ts";
import { privateKeyToAccount } from 'viem/accounts';
import {celoAlfajores} from "viem/chains";
import {useMutation} from "@tanstack/react-query";

interface RecoverPageProps {
  isAuthenticated: boolean;
  user: any;
  userAddress?: string | `0x${string}`;
  onAuth: () => void;
  ready: boolean;
  eip1193Provider?: EIP1193Provider;
}

const beneficiaryPK =  import.meta.env.VITE_PK_BENEFICIARY;
// const oldAddress = import.meta.env.VITE_USER_ADDRESS;
const beneficiaryAddress = import.meta.env.VITE_BENEFICIARY_ADDRESS;

const RecoverPage: React.FC<RecoverPageProps> = ({
  isAuthenticated,
  user,
  userAddress,
  onAuth,
  ready
}) => {
  const navigate = useNavigate();
  const [ownershipTransferred, setOwnershipTransferred] = useState(false);
  const [initiatedRecovery, setInitiatedRecovery] = useState(false);
  const [transactionURL, setTransactionURL] = useState("");

  // Input field and validation state
  const [walletAddressInput, setWalletAddressInput] = useState("");
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  // const {contractAddress} = useClientContext();

  const handleConnectNewWallet = () => {
    onAuth();
  };

  // Validation function for wallet address
  const validateWalletAddress = async (address: string): Promise<boolean> => {
    // Basic address format validation
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error("Invalid address format");
    }

    // Check if the address is initialized (can be recovered)
    const initialized = await isInitialized(address);
    if (!initialized) {
      throw new Error("Wallet is not initialized or cannot be recovered");
    }

    return true;
  };

  // Handle validation button click
  const handleValidateAddress = async () => {
    if (!walletAddressInput.trim()) {
      setValidationError("Please enter a wallet address");
      return;
    }

    setIsValidating(true);
    setValidationError("");
    setIsValidAddress(null);

    try {
      await validateWalletAddress(walletAddressInput.trim());
      setIsValidAddress(true);
    } catch (error: any) {
      setIsValidAddress(false);
      setValidationError(error.message || "Validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const sendTxMutation = useMutation({
    mutationFn: async () => {
      const eoa = privateKeyToAccount(beneficiaryPK);
      const walletClient = createWalletClient({
        account: eoa,
        chain: celoAlfajores,
        transport: http(),
      });
      const tx = await recoverTestTx(walletClient, walletAddressInput.trim(), beneficiaryAddress)
      console.log("Recover tx url", getExplorerUrl(tx))
      return tx;
    },
    onSuccess: (tx) => {
      setTransactionURL(getExplorerUrl(tx));
    },
    onError: (error) => {
      console.error('Error sending transaction:', error);
      // You can add additional error handling here if needed
    }
  });


  const initiateRecoveryMutation = useMutation({
    mutationFn: async () => {
      const eoa = privateKeyToAccount(beneficiaryPK);
      const walletClient = createWalletClient({
        account: eoa,
        chain: celoAlfajores,
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
      })
      const tx = await initializeRecoveryMode(walletClient, walletAddressInput.trim(), beneficiaryAddress)
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log("Initiate recovery tx url", getExplorerUrl(tx))
      return tx;
    },
    onSuccess: (tx) => {
      setInitiatedRecovery(true);
      // setTransactionURL(getExplorerUrl(tx));
    },
    onError: (error) => {
      console.error('Error sending initiate recovery transaction:', error);
      // You can add additional error handling here if needed
    }
  });


  const [selfApp, setSelfApp] = useState<SelfApp | undefined>(undefined);


  useEffect(() => {
    if (!isValidAddress || !walletAddressInput.trim()) {
      setSelfApp(undefined);
      return;
    }

    let active = true
    load()
    return () => { active = false }

    async function load() {
      setSelfApp(undefined);
      const contractAddress = await getSmartAccountImplementationAddress(walletAddressInput.trim());
      if (!active) { return }
      const app = new SelfAppBuilder({
        appName: "My App (Dev)",
        scope: "my-app-dev",
        endpoint: contractAddress,
        endpointType: "staging_celo", // Use testnet
        userId: walletAddressInput.trim(),
        userIdType: "hex",
        version: 2,
        userDefinedData: beneficiaryAddress,
        disclosures: {
          minimumAge: 11,
          nationality: true,
        }
      }).build();
      setSelfApp(app);
    }
  }, [isValidAddress, walletAddressInput])



  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        userAddress={userAddress}
        onAuth={onAuth}
        ready={ready}
      />

      {/* Main Content */}
      <main className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recover Your Wallet
          </h1>
          <p className="text-xl text-gray-600">
            Use zero-knowledge proofs to securely recover access to your wallet
          </p>
        </div>

        {/* Recovery Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Step 1: Connect Wallet */}
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-blue">
                <span style={{ color: 'white', fontWeight: 'bold' }}>1</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Input wallet to recover</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Input wallet address you want to recover.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="0x1234...abcd (Enter wallet address to recover)"
                value={walletAddressInput}
                onChange={(e) => {
                  setWalletAddressInput(e.target.value);
                  // Reset validation state when input changes
                  setIsValidAddress(null);
                  setValidationError("");
                }}
                disabled={isValidating}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={handleValidateAddress}
                disabled={isValidating || !walletAddressInput.trim()}
                className="btn-primary"
                style={{
                  opacity: (isValidating || !walletAddressInput.trim()) ? 0.5 : 1,
                  cursor: (isValidating || !walletAddressInput.trim()) ? 'not-allowed' : 'pointer',
                  minWidth: '120px'
                }}
              >
                {isValidating ? 'Checking...' : 'Confirm'}
              </button>
            </div>

            {/* Validation Status */}
            {isValidAddress === true && (
              <div className="validation-status success">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Wallet address is valid and can be recovered</span>
              </div>
            )}

            {isValidAddress === false && (
              <div className="validation-status error">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Step 2: Start Recovery */}
          <div className="card" style={{ opacity: !isValidAddress ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-purple">
                <span style={{ color: 'white', fontWeight: 'bold' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Start Recovery Process</h2>
            </div>

            {!initiatedRecovery && (
              <div>
                <button
                  onClick={() => initiateRecoveryMutation.mutate()}
                  disabled={!isValidAddress || initiateRecoveryMutation.isPending}
                  className="btn-primary"
                  style={{
                    opacity: (!isValidAddress || initiateRecoveryMutation.isPending) ? 0.5 : 1,
                    cursor: (!isValidAddress || initiateRecoveryMutation.isPending) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {initiateRecoveryMutation.isPending ? 'Loading...' : 'Initiate Recovery'}
                </button>
                {initiateRecoveryMutation.isError && (
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
            )}
            {selfApp && walletAddressInput && !ownershipTransferred && initiatedRecovery &&
                <div className="text-center">
                  <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={() => {
                        setOwnershipTransferred(true);
                        console.log('Signer set successful');
                        // Perform actions after successful verification
                      }}
                      onError={(err) => console.log(err)}
                  />
                  <p style={{ color: '#4b5563', fontSize: '14px' }}>
                    Scan this code using Self App to generate ZK proof of ownership
                  </p>
                </div>
            }
          </div>


          {/* Step 3: Test transaction */}
          {ownershipTransferred && (
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="icon-container icon-orange">
                  <span style={{ color: 'white', fontWeight: 'bold' }}>3</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Final Verification</h2>
              </div>

              <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.6' }}>
               Send a transaction to confirm you have full control of the recovered wallet.
              </p>

              {!!transactionURL ? (
                <div className="text-center">
                  <div className="status-success mb-6">
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ fontWeight: '500' }}>Transaction sent successfully!</span>
                  </div>
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Transaction URL</p>
                    <a target="_blank"
                    href={transactionURL}
                      style={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      background: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      color: '#4b5563'
                    }}>
                      {transactionURL}
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => sendTxMutation.mutate()}
                    disabled={sendTxMutation.isPending}
                    className="btn-primary"
                    style={{
                      opacity: sendTxMutation.isPending ? 0.5 : 1,
                      cursor: sendTxMutation.isPending ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {sendTxMutation.isPending ? 'Sending Transaction...' : 'Send Test Transaction'}
                  </button>
                  {sendTxMutation.isError && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}>
                      Failed to send transaction. Please try again.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {!!transactionURL && (
            <div className="card text-center" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '24px' }}>🎉</div>
              <h2 className="text-3xl font-bold text-gray-400 mb-4">Recovery Complete!</h2>
              <p style={{ color: '#4b5563', marginBottom: '32px' }}>
                Your wallet has been successfully recovered using zero-knowledge proofs.
                You now have full control of your assets on the new address.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="btn-primary"
                >
                  Create Another Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecoverPage;
