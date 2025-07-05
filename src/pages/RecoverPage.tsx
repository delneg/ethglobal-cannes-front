import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EIP1193Provider } from 'viem';
import Header from '../components/Header';

interface RecoverPageProps {
  isAuthenticated: boolean;
  user: any;
  userAddress?: string | `0x${string}`;
  onAuth: () => void;
  ready: boolean;
  eip1193Provider?: EIP1193Provider;
}

const RecoverPage: React.FC<RecoverPageProps> = ({
  isAuthenticated,
  user,
  userAddress,
  onAuth,
  ready
}) => {
  const navigate = useNavigate();
  const [recoveryStarted, setRecoveryStarted] = useState(false);
  const [ownershipTransferred, setOwnershipTransferred] = useState(false);
  const [messageSigned, setMessageSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectNewWallet = () => {
    onAuth();
  };

  const handleStartRecovery = () => {
    setRecoveryStarted(true);
  };

  const handleSubmitProof = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setOwnershipTransferred(true);
      setIsSubmitting(false);
    }, 3000);
  };

  const handleSignMessage = () => {
    setTimeout(() => {
      setMessageSigned(true);
    }, 2000);
  };

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
          {/* Step 1: Connect New Wallet */}
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-blue">
                <span style={{ color: 'white', fontWeight: 'bold' }}>1</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Connect New Wallet</h2>
            </div>

            {isAuthenticated && userAddress ? (
              <div className="status-success">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontWeight: '500' }}>New wallet connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
              </div>
            ) : isAuthenticated && !userAddress ? (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Loading wallet address...
              </div>
            ) : (
              <button
                onClick={handleConnectNewWallet}
                className="btn-primary"
                disabled={!ready}
                style={{ opacity: ready ? 1 : 0.6 }}
              >
                {!ready ? 'Loading...' : 'Connect New Wallet'}
              </button>
            )}
          </div>

          {/* Step 2: Start Recovery */}
          <div className="card" style={{ opacity: !(isAuthenticated && userAddress) ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-purple">
                <span style={{ color: 'white', fontWeight: 'bold' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Start Recovery Process</h2>
            </div>

            {!recoveryStarted ? (
              <button
                onClick={handleStartRecovery}
                disabled={!(isAuthenticated && userAddress)}
                className="btn-primary"
                style={{
                  opacity: !(isAuthenticated && userAddress) ? 0.5 : 1,
                  cursor: !(isAuthenticated && userAddress) ? 'not-allowed' : 'pointer'
                }}
              >
                Start Recovery
              </button>
            ) : (
              <div className="text-center">
                <div className="qr-placeholder" style={{ margin: '0 auto 16px auto' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔐</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Recovery QR Code</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontFamily: 'monospace' }}>
                    zkproof://recovery/{Date.now()}
                  </div>
                </div>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>
                  Scan this code using Self App to generate ZK proof of ownership
                </p>
              </div>
            )}
          </div>


          {/* Step 4: Sign Message */}
          {ownershipTransferred && (
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="icon-container icon-orange">
                  <span style={{ color: 'white', fontWeight: 'bold' }}>4</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Final Verification</h2>
              </div>

              <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.6' }}>
                Sign a message to confirm you have full control of the recovered wallet.
              </p>

              {messageSigned ? (
                <div className="text-center">
                  <div className="status-success mb-6">
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ fontWeight: '500' }}>Message signed successfully!</span>
                  </div>
                  <div style={{ 
                    background: '#f9fafb', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    border: '1px solid #e5e7eb' 
                  }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>Signed Message:</p>
                    <p style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '14px', 
                      background: 'white', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      border: '1px solid #e5e7eb' 
                    }}>
                      "ETHGlobal Cannes 2025 - Wallet Recovery Completed"
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignMessage}
                  className="btn-primary"
                >
                  Sign "ETHGlobal Cannes 2025"
                </button>
              )}
            </div>
          )}

          {/* Success Message */}
          {messageSigned && (
            <div className="card text-center" style={{ 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)', 
              border: '1px solid #bbf7d0' 
            }}>
              <div style={{ fontSize: '60px', marginBottom: '24px' }}>🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recovery Complete!</h2>
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
