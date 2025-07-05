import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const RecoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [newWalletConnected, setNewWalletConnected] = useState(false);
  const [recoveryStarted, setRecoveryStarted] = useState(false);
  const [ownershipTransferred, setOwnershipTransferred] = useState(false);
  const [messageSigned, setMessageSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectNewWallet = () => {
    setTimeout(() => {
      setNewWalletConnected(true);
    }, 1000);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

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

            {newWalletConnected ? (
              <div className="status-success">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontWeight: '500' }}>New wallet connected: 0xCD...5678</span>
              </div>
            ) : (
              <button
                onClick={handleConnectNewWallet}
                className="btn-primary"
              >
                Connect New Wallet
              </button>
            )}
          </div>

          {/* Step 2: Start Recovery */}
          <div className="card" style={{ opacity: !newWalletConnected ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-purple">
                <span style={{ color: 'white', fontWeight: 'bold' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Start Recovery Process</h2>
            </div>

            {!recoveryStarted ? (
              <button
                onClick={handleStartRecovery}
                disabled={!newWalletConnected}
                className="btn-primary"
                style={{ 
                  opacity: !newWalletConnected ? 0.5 : 1,
                  cursor: !newWalletConnected ? 'not-allowed' : 'pointer'
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

          {/* Step 3: Submit Proof */}
          <div className="card" style={{ opacity: !recoveryStarted ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-green">
                <span style={{ color: 'white', fontWeight: 'bold' }}>3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Submit ZK Proof</h2>
            </div>

            <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.6' }}>
              After scanning the QR code with your Self App, submit the generated zero-knowledge proof to complete the recovery.
            </p>

            {ownershipTransferred ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="status-success">
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>Ownership Transferred!</span>
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>
                  Your wallet ownership has been successfully transferred to the new address.
                </p>
              </div>
            ) : (
              <button
                onClick={handleSubmitProof}
                disabled={!recoveryStarted || isSubmitting}
                className="btn-primary"
                style={{ 
                  opacity: (!recoveryStarted || isSubmitting) ? 0.5 : 1,
                  cursor: (!recoveryStarted || isSubmitting) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg className="animate-spin" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying Proof...
                  </span>
                ) : (
                  'Submit Proof'
                )}
              </button>
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
