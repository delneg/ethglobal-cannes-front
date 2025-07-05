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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <span style={{ marginLeft: '12px', fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text)' }}>
              RecoveryApp
            </span>
          </div>

          {/* Navigation and Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Pill Navigation - только на домашней странице */}
            {isHomePage && (
              <nav style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(28, 42, 40, 0.5)',
                borderRadius: '50px',
                padding: '4px',
                gap: '4px'
              }}>
                {[
                  { id: 'how-it-works', label: 'How it works' },
                  { id: 'features', label: 'Features' },
                  { id: 'blogs', label: 'Blogs' },
                  { id: 'about', label: 'About us' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-surface)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Auth Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAuthenticated && userAddress ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-success)'
                  }}></div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--color-success)',
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
                      : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    border: isAuthenticated ? '1px solid var(--color-border)' : 'none',
                    color: isAuthenticated ? 'var(--color-text-secondary)' : 'var(--color-background)',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: ready ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: ready ? 1 : 0.6,
                    boxShadow: isAuthenticated ? 'none' : '0 4px 20px rgba(31, 230, 156, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (ready && !isAuthenticated) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 25px rgba(31, 230, 156, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (ready && !isAuthenticated) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(31, 230, 156, 0.3)';
                    }
                  }}
                >
                  {!ready ? 'Loading...' : isAuthenticated ? 'Disconnect' : 'Authorize'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
