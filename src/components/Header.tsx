import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: any;
  userAddress?: string | `0x${string}`;
  onAuth?: () => void;
  ready?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  user,
  userAddress,
  onAuth,
  ready = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center py-6" style={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <div 
            className="flex items-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <div className="logo">
              <span>ZK</span>
            </div>
            <span style={{ marginLeft: '12px', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              RecoveryApp
            </span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            )}

            {isHomePage && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => navigate('/create')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => navigate('/recover')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Recover
                </button>
              </div>
            )}

            {/* Auth Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAuthenticated && userAddress ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '6px 12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#16a34a'
                  }}></div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#166534',
                    fontFamily: 'monospace'
                  }}>
                    {formatAddress(userAddress)}
                  </span>
                </div>
              ) : null}

              {onAuth && (
                <button
                  onClick={onAuth}
                  disabled={!ready}
                  style={{
                    background: isAuthenticated
                      ? 'transparent'
                      : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    border: isAuthenticated ? '1px solid #e5e7eb' : 'none',
                    color: isAuthenticated ? '#6b7280' : 'white',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: ready ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: ready ? 1 : 0.6
                  }}
                >
                  {!ready ? 'Loading...' : isAuthenticated ? 'Disconnect' : 'Connect'}
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
