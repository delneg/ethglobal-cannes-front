import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EIP1193Provider } from 'viem';
import Header from './Header';
import { User } from '@privy-io/react-auth';

interface HomePageProps {
  isAuthenticated: boolean;
  user: User | null;
  userAddress?: string;
  onAuth: () => void;
  ready: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated,
  user,
  userAddress,
  onAuth,
  ready
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    img.src = '/hero-card.png';
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        userAddress={userAddress}
        onAuth={onAuth}
        ready={ready}
      />

      {/* Hero Section */}
      <main className="main">
        <div className="container">
        {/* Decorative Stars */}
        <div className="hero-star" style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-star" style={{ position: 'absolute', top: '20%', right: '8%', zIndex: 1, transform: 'rotate(45deg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-star" style={{ position: 'absolute', bottom: '25%', left: '15%', zIndex: 1, transform: 'rotate(-30deg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-star" style={{ position: 'absolute', top: '60%', right: '20%', zIndex: 1, transform: 'rotate(90deg)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-star" style={{ position: 'absolute', bottom: '10%', right: '5%', zIndex: 1, transform: 'rotate(180deg)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-star" style={{ position: 'absolute', bottom: '20%', right: '40%', zIndex: 1, transform: 'rotate(45deg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.26L21 12L14.74 12.74L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.74L3 12L9.26 11.26L5 7L10.91 8.26L12 2Z" fill="white" />
          </svg>
        </div>

        <div className="hero-grid" style={{
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Column - Content */}
          <div className="hero-content">
            {/* Main Title */}
            <h1 className="text-5xl font-bold text-gray-900 mb-6" style={{ lineHeight: '1.1', textAlign: 'left' }}>
              Private Key Recovery
              <span className="gradient-text" style={{ display: 'block' }}>
                via ZK + 7702
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12" style={{ lineHeight: '1.75', textAlign: 'left' }}>
              Secure, decentralized wallet recovery using zero-knowledge proofs and EIP-7702 account abstraction.
              Recover your private keys without compromising security or relying on centralized services.
            </p>

            {/* Action Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
              <button
                onClick={() => navigate('/setuprecovery')}
                className="btn-primary"
                style={{ width: '220px', fontSize: '18px' }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Set Up Recovery
              </button>

              <button
                onClick={() => navigate('/recover')}
                className="btn-secondary"
                style={{ width: '220px', fontSize: '18px' }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recovery
              </button>
            </div>
          </div>

          {/* Right Column - Background Image */}
          <div className="hero-image" style={{
            height: '500px',
            backgroundImage: imageLoaded ? 'url(/hero-card.png)' : 'none',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Fallback если изображение не загрузилось */}
            {!imageLoaded && (
              <div className="hero-image-fallback" style={{
                width: '400px',
                height: '500px',
                background: 'var(--color-surface)',
                border: '2px dashed var(--color-border)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                opacity: 0.5
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '40px', height: '40px', color: 'var(--color-background)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  Place hero-card.png in public folder
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>

      {/* How it works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How it Works</h2>
            <p className="text-xl text-gray-600" style={{ maxWidth: '720px', margin: '20px auto' }}>
              From wallet creation to full recovery — powered by ZK, 7702 and Self Protocol.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card text-center">
              <div className="icon-container icon-blue mb-6" style={{ margin: '0 auto 24px auto' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create & Link Passport</h3>
              <p className="text-gray-600">
                Connect your wallet using Privy. Scan your Self Passport and register it as a recovery method via QR on our frontend.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card text-center">
              <div className="icon-container icon-purple mb-6" style={{ margin: '0 auto 24px auto' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lose Access — Recover</h3>
              <p className="text-gray-600">
                Lost access? Log in again with a new wallet via Privy and click <strong>“Recover”</strong>. Scan the recovery QR in Self App.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center">
              <div className="icon-container icon-green mb-6" style={{ margin: '0 auto 24px auto' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transfer Ownership</h3>
              <p className="text-gray-600">
                Self generates a ZK-proof. It’s submitted to the smart contract. Ownership of your 7702 account is transferred to the new wallet. Sign “ETHGlobal Cannes 2025” to prove it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-16" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container py-8">
          <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            <p>&copy; 2025 ETHGlobal Cannes. Built with ❤️ for the future of Web3.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
