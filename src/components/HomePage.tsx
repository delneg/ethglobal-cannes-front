import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EIP1193Provider } from 'viem';
import Header from './Header';

interface HomePageProps {
  isAuthenticated: boolean;
  user: any;
  userAddress?: string | `0x${string}`;
  onAuth: () => void;
  ready: boolean;
  eip1193Provider?: EIP1193Provider;
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
    // Проверяем, существует ли изображение
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
      <main className="container py-16">
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          minHeight: '70vh'
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
                onClick={() => navigate('/create')}
                className="btn-primary"
                style={{ minWidth: '200px', fontSize: '18px' }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Authorize
              </button>

              <button
                onClick={() => navigate('/recover')}
                className="btn-secondary"
                style={{ minWidth: '200px', fontSize: '18px' }}
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


      </main>

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
