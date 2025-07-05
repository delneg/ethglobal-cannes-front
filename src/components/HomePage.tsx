import React from 'react';
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        userAddress={userAddress}
        onAuth={onAuth}
        ready={ready}
      />

      {/* Hero Section */}
      <main className="container py-16">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6" style={{ lineHeight: '1.1' }}>
            Private Key Recovery
            <span className="gradient-text" style={{ display: 'block' }}>
              via ZK + 7702
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12" style={{ maxWidth: '768px', margin: '0 auto 48px auto', lineHeight: '1.75' }}>
            Secure, decentralized wallet recovery using zero-knowledge proofs and EIP-7702 account abstraction.
            Recover your private keys without compromising security or relying on centralized services.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-6 items-center mb-16" style={{ gap: '24px' }}>
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

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="card text-center">
              <div className="icon-container icon-blue mb-4" style={{ margin: '0 auto 16px auto', width: '64px', height: '64px' }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-gray-600">
                Prove ownership without revealing sensitive information using advanced cryptographic techniques.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container icon-purple mb-4" style={{ margin: '0 auto 16px auto', width: '64px', height: '64px' }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">EIP-7702 Integration</h3>
              <p className="text-gray-600">
                Leverage account abstraction for seamless wallet recovery and enhanced user experience.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container icon-green mb-4" style={{ margin: '0 auto 16px auto', width: '64px', height: '64px' }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Decentralized Security</h3>
              <p className="text-gray-600">
                No single point of failure. Your recovery process is distributed and trustless.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16" style={{ paddingTop: '64px', borderTop: '1px solid #e5e7eb' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">48h</div>
              <div className="text-gray-600 font-medium">To Build</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">$100K+</div>
              <div className="text-gray-600 font-medium">In Prizes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">Web3</div>
              <div className="text-gray-600 font-medium">Future</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16" style={{ borderTop: '1px solid #e5e7eb' }}>
        <div className="container py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 ETHGlobal Cannes. Built with ❤️ for the future of Web3.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
