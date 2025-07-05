import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CreateWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [recoveryBound, setRecoveryBound] = useState(false);
  const [isBinding, setIsBinding] = useState(false);

  const handleConnectWallet = () => {
    setTimeout(() => {
      setWalletConnected(true);
    }, 1000);
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const handleBindRecovery = async () => {
    setIsBinding(true);
    setTimeout(() => {
      setRecoveryBound(true);
      setIsBinding(false);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      {/* Main Content */}
      <main className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#6b7280', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            marginBottom: '8px' 
          }}>
            Step 1 of 3
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Create Wallet + Bind Passport
          </h1>
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

            {walletConnected ? (
              <div className="status-success">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontWeight: '500' }}>Wallet connected: 0xAB...1234</span>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Step 2: Link Self Passport */}
          <div className="card" style={{ opacity: !walletConnected ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-purple">
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Link Self Passport</h2>
            </div>

            {!qrGenerated ? (
              <button
                onClick={handleGenerateQR}
                disabled={!walletConnected}
                className="btn-primary"
                style={{ 
                  opacity: !walletConnected ? 0.5 : 1,
                  cursor: !walletConnected ? 'not-allowed' : 'pointer'
                }}
              >
                Show QR for Self App
              </button>
            ) : (
              <div className="text-center">
                <div className="qr-placeholder" style={{ margin: '0 auto 16px auto' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>📱</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>QR Code Placeholder</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontFamily: 'monospace' }}>
                    self://fingerprint/{Date.now()}
                  </div>
                </div>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>
                  Scan this code using your Self App to authorize this device for recovery.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Initialize Recovery Module */}
          <div className="card" style={{ opacity: !qrGenerated ? 0.5 : 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container icon-green">
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Initialize Recovery Module</h2>
            </div>

            <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.6' }}>
              This will send a transaction to bind your Self ID as a recovery method to your 7702 smart account.
            </p>

            {recoveryBound ? (
              <div className="status-success">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontWeight: '500' }}>Bound successfully!</span>
              </div>
            ) : (
              <button
                onClick={handleBindRecovery}
                disabled={!qrGenerated || isBinding}
                className="btn-primary"
                style={{ 
                  opacity: (!qrGenerated || isBinding) ? 0.5 : 1,
                  cursor: (!qrGenerated || isBinding) ? 'not-allowed' : 'pointer'
                }}
              >
                {isBinding ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg className="animate-spin" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Bind for Recovery (Send Tx)'
                )}
              </button>
            )}
          </div>

          {/* Final Step: Success */}
          {recoveryBound && (
            <div className="card text-center" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '24px' }}>🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You're ready!</h2>
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

export default CreateWalletPage;
