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
