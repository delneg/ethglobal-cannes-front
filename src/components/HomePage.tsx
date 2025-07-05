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
      <main className="container py-16" style={{ position: 'relative' }}>
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          minHeight: '70vh',
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
                onClick={() => navigate('/create')}
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


      </main>

      {/* How it works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-xl text-gray-600" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Simple, secure, and decentralized wallet recovery in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="icon-container icon-blue mb-6" style={{ margin: '0 auto 24px auto', width: '80px', height: '80px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Setup Recovery</h3>
              <p className="text-gray-600">
                Connect your wallet and bind your Self passport to create a secure recovery method using zero-knowledge proofs.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container icon-purple mb-6" style={{ margin: '0 auto 24px auto', width: '80px', height: '80px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate Proof</h3>
              <p className="text-gray-600">
                When recovery is needed, scan the QR code with Self App to generate a cryptographic proof of ownership.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container icon-green mb-6" style={{ margin: '0 auto 24px auto', width: '80px', height: '80px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recover Access</h3>
              <p className="text-gray-600">
                Submit the proof to transfer ownership to your new wallet. Your assets are now accessible again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Features</h2>
            <p className="text-xl text-gray-600" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Advanced cryptographic techniques meet user-friendly design
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12" style={{ alignItems: 'center' }}>
            <div>
              <div className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container icon-blue" style={{ width: '48px', height: '48px' }}>
                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Zero-Knowledge Security</h3>
                </div>
                <p className="text-gray-600">
                  Prove ownership without revealing sensitive information. Your private keys remain private throughout the recovery process.
                </p>
              </div>

              <div className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container icon-green" style={{ width: '48px', height: '48px' }}>
                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">EIP-7702 Integration</h3>
                </div>
                <p className="text-gray-600">
                  Leverage the latest Ethereum account abstraction standard for seamless wallet recovery and enhanced user experience.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: 'var(--color-surface)',
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Feature Illustration
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Decentralized & Trustless</h3>
              <p className="text-gray-600">
                No central authority controls your recovery process. Everything happens on-chain with cryptographic guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" style={{ padding: '80px 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Latest Blogs</h2>
            <p className="text-xl text-gray-600" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Stay updated with the latest developments in Web3 security and wallet recovery
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: "Understanding Zero-Knowledge Proofs in Wallet Recovery",
                excerpt: "Learn how ZK proofs enable secure wallet recovery without compromising your private information.",
                date: "Dec 15, 2024"
              },
              {
                title: "EIP-7702: The Future of Account Abstraction",
                excerpt: "Explore how the latest Ethereum improvement proposal revolutionizes wallet functionality.",
                date: "Dec 10, 2024"
              },
              {
                title: "Building Trustless Recovery Systems",
                excerpt: "Deep dive into the architecture of decentralized wallet recovery mechanisms.",
                date: "Dec 5, 2024"
              }
            ].map((blog, index) => (
              <div key={index} className="card" style={{ cursor: 'pointer' }}>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'var(--color-background)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    Blog Image
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  {blog.date}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{blog.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-12" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Us</h2>
              <p className="text-xl text-gray-600 mb-8">
                We're building the future of secure, decentralized wallet recovery using cutting-edge cryptographic techniques.
              </p>
              <p className="text-gray-600 mb-6">
                Our team combines expertise in zero-knowledge cryptography, blockchain technology, and user experience design
                to create solutions that are both highly secure and easy to use.
              </p>
              <p className="text-gray-600 mb-8">
                Built for ETHGlobal Cannes 2025, this project represents our vision for a world where losing access to your
                crypto wallet doesn't mean losing your assets forever.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-primary">Learn More</button>
                <button className="btn-secondary">Contact Us</button>
              </div>
            </div>

            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{
                width: '300px',
                height: '300px',
                background: 'var(--color-surface)',
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Team Photo / Illustration
                </span>
              </div>
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
