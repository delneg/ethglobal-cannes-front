import React, {useEffect, useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Address, createPublicClient, createWalletClient, EIP1193Provider, http, isAddress, isHex, formatEther, custom} from 'viem';
import Header from '../components/Header';
import {SelfApp, SelfAppBuilder, SelfQRcodeWrapper} from "@selfxyz/qrcode";
import {useSignMessage, useLogin, useWallets, useLogout} from '@privy-io/react-auth';
import {useClientContext} from "../context/ClientContext.tsx";
import {
  recoverTestTx,
  getExplorerUrl,
  initializeRecoveryMode,
  isInitialized, getMasterNullifier, isAllowedSigner, getRecoveryWrapperAddress, finishRecoveryMode, IMPLEMENTATION_ABI
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
  const [signerAdded, setSignerAdded] = useState(false);
  const [recoveryFinished, setRecoveryFinished] = useState(false);
  const [transactionURL, setTransactionURL] = useState("");

  // Signer address input state
  const [signerAddressInput, setSignerAddressInput] = useState("");
  const [isValidSignerAddress, setIsValidSignerAddress] = useState<boolean | null>(null);
  const [signerValidationError, setSignerValidationError] = useState("");

  // Input field and validation state
  const [walletAddressInput, setWalletAddressInput] = useState("");
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Common state
  const [allowedSigner, setAllowedSigner] = useState<Address | null>(null);

  // Balance checking state
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Signer wallet connection state
  const [connectedSignerAddress, setConnectedSignerAddress] = useState<Address | null>(null);
  const [signerWalletClient, setSignerWalletClient] = useState<any>(null);
  const [isConnectingSigner, setIsConnectingSigner] = useState(false);
  const [signerConnectionError, setSignerConnectionError] = useState<string | null>(null);

  // const {contractAddress} = useClientContext();

  // Privy hooks
  const {wallets} = useWallets();
  const {login} = useLogin();
  const {logout} = useLogout();

  // Handle validation button click
  const handleValidateAddress = async () => {
    if (!walletAddressInput.trim()) {
      setValidationError("Please enter a wallet address");
      return;
    }

    setIsValidating(true);
    setValidationError("");
    setIsValidAddress(null);

    if (!isAddress(walletAddressInput)) {
      setIsValidAddress(false);
      setValidationError("Invalid address");
      setIsValidating(false);
      return;
    }

    const isAccountInitialized = await isInitialized(walletAddressInput)
    if (!isAccountInitialized) {
      setIsValidAddress(false);
      setValidationError("Wallet is not initialized. You should setup recovery first.");
      setIsValidating(false);
      return;
    }

    const nullifierAttached = await getMasterNullifier(walletAddressInput)
    console.log('Nullifier attached: ', nullifierAttached)
    if (nullifierAttached == 0n) {
      setIsValidAddress(false);
      setValidationError("Passport was not attached. You should finish setup first.");
      setIsValidating(false);
      return;
    }

    setIsValidAddress(true);
    setIsValidating(false);
  };

  // Handle signer address validation
  const handleValidateSignerAddress = async () => {
    if (!signerAddressInput.trim()) {
      setSignerValidationError("Please enter a signer address");
      return;
    }

    if (!isAddress(signerAddressInput)) {
      setIsValidSignerAddress(false);
      setSignerValidationError("Invalid signer address");
      return;
    }

    const isSignerAlreadyAllowed = await isAllowedSigner(walletAddressInput as Address, signerAddressInput)
    if (isSignerAlreadyAllowed) {
      setIsValidSignerAddress(true);
      setOwnershipTransferred(true);
      setSignerAdded(true)
      setAllowedSigner(signerAddressInput)

      return;
    }

    setIsValidSignerAddress(true);
    setSignerValidationError("");
    setSignerAdded(true);
  };

  // Handle balance checking
  const handleCheckBalance = async () => {
    if (!walletAddressInput.trim()) {
      setBalanceError("No wallet address provided");
      return;
    }

    setIsCheckingBalance(true);
    setBalanceError(null);
    setUserBalance(null);

    try {
      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: http()
      });

      const balance = await publicClient.getBalance({
        address: walletAddressInput.trim() as Address,
      });

      setUserBalance(formatEther(balance));
    } catch (error) {
      console.error('Error checking balance:', error);
      setBalanceError("Failed to fetch balance. Please try again.");
    } finally {
      setIsCheckingBalance(false);
    }
  };

  // Handle connecting allowed signer wallet
  const handleConnectAllowedSigner = async () => {
    if (!walletAddressInput.trim()) {
      setSignerConnectionError("No wallet address provided");
      return;
    }

    if (!allowedSigner) {
      setSignerConnectionError("No allowed signer found. Complete previous steps first.");
      return;
    }

    setIsConnectingSigner(true);
    setSignerConnectionError(null);
    setConnectedSignerAddress(null);
    setSignerWalletClient(null);

    try {
      // First, disconnect from Privy to ensure clean connection
      console.log('Disconnecting from Privy...');
      await logout();

      // Wait a moment for the logout to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Now prompt user to connect their wallet
      console.log('Prompting user to connect wallet...');
      await login();

      // After login, the useEffect will handle checking if the connected wallet
      // is the allowed signer and create the walletClient accordingly
    } catch (error) {
      console.error('Error connecting allowed signer wallet:', error);
      setSignerConnectionError("Failed to connect wallet. Please try again.");
      setIsConnectingSigner(false);
    }
    // Note: setIsConnectingSigner(false) is handled in the useEffect after wallet validation
  };

  const sendTxMutation = useMutation({
    mutationFn: async () => {
      if (!signerWalletClient) {
        throw new Error("No signer wallet connected. Please connect the allowed signer wallet first.");
      }

      if (!connectedSignerAddress) {
        throw new Error("Connected signer address not found.");
      }

      try {
        // Create a custom implementation of recoverTestTx to ensure account is properly set
        const publicClient = createPublicClient({
          chain: celoAlfajores,
          transport: http()
        });

        const pendingBalance = await publicClient.getBalance({
          address: walletAddressInput.trim() as Address,
        });

        console.log('Pending balance:', pendingBalance);
        console.log('Recovering to address:', connectedSignerAddress);

        const hash = await signerWalletClient.writeContract({
          abi: IMPLEMENTATION_ABI,
          address: walletAddressInput.trim() as Address,
          functionName: 'recover',
          args: [connectedSignerAddress, pendingBalance, "0x"],
          account: connectedSignerAddress
        });

        console.log("Recover tx hash:", hash);
        return hash;
      } catch (error) {
        console.error("Error in recovery transaction:", error);
        throw error;
      }
    },
    onSuccess: (tx) => {
      setTransactionURL(getExplorerUrl(tx));
    },
    onError: (error) => {
      console.error('Error sending transaction:', error);
      // You can add additional error handling here if needed
    }
  });

  const finishRecoveryMutation = useMutation({
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
      const tx = await finishRecoveryMode(walletClient, walletAddressInput.trim())
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log("Finish recovery tx url", getExplorerUrl(tx))
      return tx;
    },
    onSuccess: (tx) => {
      setRecoveryFinished(true)
      console.log("Recovery finished tx url", getExplorerUrl(tx));
    },
    onError: (error) => {
      setRecoveryFinished(false)
      console.error('Error sending transaction:', error);
      // You can add additional error handling here if needed
    }
  })

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
      const tx = await initializeRecoveryMode(walletClient, walletAddressInput.trim())
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
      const contractAddress = await getRecoveryWrapperAddress(walletAddressInput.trim());
      if (!active) { return }
      const app = new SelfAppBuilder({
        appName: "My App (Dev)",
        scope: "my-app-dev",
        endpoint: contractAddress,
        endpointType: "staging_celo", // Use testnet
        userId: walletAddressInput.trim(),
        userIdType: "hex",
        version: 2,
        userDefinedData: signerAddressInput.slice(2),
        disclosures: {
          minimumAge: 11,
          nationality: true,
        }
      }).build();
      setSelfApp(app);
    }
  }, [isValidAddress, signerAddressInput])

  // Handle wallet changes and check if connected wallet is allowed signer
  useEffect(() => {
    if (!allowedSigner) return;

    const checkConnectedWallet = async () => {
      if (wallets.length === 0) {
        // No wallets connected
        if (isConnectingSigner) {
          // If we're in the middle of connecting, this means logout completed
          // Keep the loading state until login completes
          return;
        }
        return;
      }

      // Find wallet that matches the allowed signer
      const matchingWallet = wallets.find(wallet =>
        wallet.address.toLowerCase() === allowedSigner.toLowerCase()
      );

      if (matchingWallet && !connectedSignerAddress) {
        try {
          const provider = await matchingWallet.getEthereumProvider();
          const walletClient = createWalletClient({
            account: matchingWallet.address as Address,
            chain: celoAlfajores,
            transport: custom(provider)
          });

          setConnectedSignerAddress(matchingWallet.address as Address);
          setSignerWalletClient(walletClient);
          setSignerConnectionError(null);
          setIsConnectingSigner(false); // Connection successful, stop loading
          console.log('Allowed signer wallet connected:', matchingWallet.address);
        } catch (error) {
          console.error('Error setting up wallet client:', error);
          setSignerConnectionError("Failed to setup wallet client.");
          setIsConnectingSigner(false);
        }
      } else if (wallets.length > 0 && !matchingWallet && isConnectingSigner) {
        // A wallet was connected but it's not the allowed signer
        const connectedWallet = wallets[wallets.length - 1]; // Get the most recently connected wallet
        setSignerConnectionError(
          `Connected wallet (${connectedWallet.address}) is not the allowed signer (${allowedSigner}). Please disconnect and connect the correct wallet.`
        );
        setIsConnectingSigner(false);
      }
    };

    checkConnectedWallet();
  }, [wallets, allowedSigner, connectedSignerAddress, isConnectingSigner])



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

          {/* Step 2: Initiate Recovery */}
          <div className="card" style={{ opacity: !isValidAddress ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-purple">
                <span style={{ color: 'white', fontWeight: 'bold' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Initiate recovery</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Click confirm to start the recovery process for your wallet.
            </p>

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
                  {initiateRecoveryMutation.isPending ? 'Loading...' : 'Confirm'}
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

            {initiatedRecovery && (
              <div className="validation-status success">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Recovery process initiated successfully</span>
              </div>
            )}
          </div>

          {/* Step 3: Add Allowed Signer */}
          <div className="card" style={{ opacity: !initiatedRecovery ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-green">
                <span style={{ color: 'white', fontWeight: 'bold' }}>3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Add allowed signer</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Enter the address that will be allowed to sign transactions for the recovered wallet.
            </p>

            {!signerAdded && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="0x1234...abcd (Enter signer address)"
                    value={signerAddressInput}
                    onChange={(e) => {
                      setSignerAddressInput(e.target.value);
                      // Reset validation state when input changes
                      setIsValidSignerAddress(null);
                      setSignerValidationError("");
                    }}
                    disabled={!initiatedRecovery}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <button
                    onClick={handleValidateSignerAddress}
                    disabled={!initiatedRecovery || !signerAddressInput.trim()}
                    className="btn-primary"
                    style={{
                      opacity: (!initiatedRecovery || !signerAddressInput.trim()) ? 0.5 : 1,
                      cursor: (!initiatedRecovery || !signerAddressInput.trim()) ? 'not-allowed' : 'pointer',
                      minWidth: '120px'
                    }}
                  >
                    Confirm
                  </button>
                </div>

                {/* Signer Validation Status */}
                {isValidSignerAddress === false && (
                  <div className="validation-status error">
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{signerValidationError}</span>
                  </div>
                )}
              </div>
            )}

            {signerAdded && (
              <div className="validation-status success">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Signer address added successfully</span>
              </div>
            )}
          </div>

          {/* Step 4: Start Recovery Process */}
          <div className="card" style={{ opacity: !signerAdded ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-orange">
                <span style={{ color: 'white', fontWeight: 'bold' }}>4</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Start Recovery Process</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Scan the QR code with your Self app to generate a zero-knowledge proof of ownership.
            </p>

            {selfApp && walletAddressInput && !ownershipTransferred && signerAdded &&
                <div className="text-center">
                  <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={() => {
                        setOwnershipTransferred(true);
                        setAllowedSigner(signerAddressInput as Address);
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

          {/* Step 5: Confirm added signer */}
          <div className="card" style={{ opacity: !ownershipTransferred ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-teal">
                <span style={{ color: 'white', fontWeight: 'bold' }}>5</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Confirm added signer</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Complete the recovery process by confirming the ownership transfer.
            </p>

            {/* Display allowed signer address */}
            {allowedSigner && (
              <div className="validation-status success" style={{ marginBottom: '16px' }}>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span style={{ fontWeight: '500' }}>Allowed Signer Address:</span>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    marginTop: '4px',
                    wordBreak: 'break-all',
                    opacity: '0.9'
                  }}>
                    {allowedSigner}
                  </div>
                </div>
              </div>
            )}

            {!recoveryFinished && ownershipTransferred && (
              <div>
                <button
                  onClick={() => finishRecoveryMutation.mutate()}
                  disabled={!ownershipTransferred || finishRecoveryMutation.isPending}
                  className="btn-primary"
                  style={{
                    opacity: (finishRecoveryMutation.isPending || !ownershipTransferred) ? 0.5 : 1,
                    cursor: (finishRecoveryMutation.isPending || !ownershipTransferred) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {finishRecoveryMutation.isPending ? 'Loading...' : 'Confirm'}
                </button>
              </div>
            )}

            {recoveryFinished && (
              <div className="validation-status success">
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>New signer successfully attached</span>
              </div>
            )}
          </div>

          {/* Step 6: Final Verification */}
          {recoveryFinished && (
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="icon-container icon-red">
                  <span style={{ color: 'white', fontWeight: 'bold' }}>6</span>
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
                  {/* Balance Display */}
                  {userBalance && (
                    <div className="validation-status success" style={{ marginBottom: '16px' }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <span style={{ fontWeight: '500' }}>Wallet Balance:</span>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          marginTop: '4px',
                          opacity: '0.9'
                        }}>
                          {userBalance} CELO
                        </div>
                      </div>
                    </div>
                  )}

                  {balanceError && (
                    <div className="validation-status error" style={{ marginBottom: '16px' }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{balanceError}</span>
                    </div>
                  )}

                  {/* Signer Wallet Connection Display */}
                  {connectedSignerAddress && (
                    <div className="validation-status success" style={{ marginBottom: '16px' }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span style={{ fontWeight: '500' }}>Allowed Signer Connected:</span>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          marginTop: '4px',
                          opacity: '0.9',
                          wordBreak: 'break-all'
                        }}>
                          {connectedSignerAddress}
                        </div>
                      </div>
                    </div>
                  )}

                  {signerConnectionError && (
                    <div className="validation-status error" style={{ marginBottom: '16px' }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{signerConnectionError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleCheckBalance}
                      disabled={isCheckingBalance}
                      className="btn-secondary"
                      style={{
                        opacity: isCheckingBalance ? 0.5 : 1,
                        cursor: isCheckingBalance ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCheckingBalance ? 'Checking...' : 'Check Balance'}
                    </button>

                    <button
                      onClick={handleConnectAllowedSigner}
                      disabled={isConnectingSigner || !allowedSigner}
                      className="btn-secondary"
                      style={{
                        opacity: (isConnectingSigner || !allowedSigner) ? 0.5 : 1,
                        cursor: (isConnectingSigner || !allowedSigner) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isConnectingSigner ? 'Connecting...' : 'Connect Allowed Signer Wallet'}
                    </button>

                    <button
                      onClick={() => sendTxMutation.mutate()}
                      disabled={sendTxMutation.isPending || !signerWalletClient}
                      className="btn-primary"
                      style={{
                        opacity: (sendTxMutation.isPending || !signerWalletClient) ? 0.5 : 1,
                        cursor: (sendTxMutation.isPending || !signerWalletClient) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {sendTxMutation.isPending ? 'Sending Transaction...' : 'Withdraw funds to allowed signer'}
                    </button>
                  </div>

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
