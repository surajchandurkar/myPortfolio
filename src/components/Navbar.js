'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand / Logo */}
        <Link href="/" className="nav-brand" aria-label="Suraj K. Chandurkar Home">
          <div className="brand-avatar">SC</div>
          <div className="brand-text">
            <span className="brand-name">Suraj K. Chandurkar</span>
            <div className="brand-status-row">
              <span className="pulse-dot" />
              <span className="brand-role">Software Developer</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links - High Contrast & Clearly Defined */}
        <nav className="nav-links-bar hide-on-mobile" aria-label="Main Navigation">
          <Link 
            href="/#about" 
            className={`nav-item ${pathname === '/' ? 'active-nav-item' : ''}`}
          >
            About
          </Link>
          <Link href="/#experience" className="nav-item">
            Experience
          </Link>
          <Link href="/#projects" className="nav-item">
            Projects
          </Link>
          <Link href="/#skills" className="nav-item">
            Skills
          </Link>
          <Link href="/#contact" className="nav-item">
            Contact
          </Link>
          
          {/* HIGHLY VISIBLE CAPTCHA TEST LINK */}
          <Link 
            href="/captcha-test" 
            className={`captcha-nav-btn ${pathname === '/captcha-test' ? 'active-captcha' : ''}`}
            id="nav-captcha-test-link"
          >
            <span className="shield-icon">🛡️</span>
            <span>Captcha Test</span>
            <span className="badge-new">NEW</span>
          </Link>
        </nav>

        {/* Actions: Theme Switcher & Mobile Menu Toggle */}
        <div className="nav-actions">
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            aria-label="Toggle dark/light mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button 
            type="button"
            className="mobile-toggle-btn show-on-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer show-on-mobile">
          <div className="mobile-status-banner">
            <span className="pulse-dot" />
            <strong>Currently Working as Software Developer</strong>
          </div>
          <Link href="/#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            About Me
          </Link>
          <Link href="/#experience" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Experience
          </Link>
          <Link href="/#projects" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/#skills" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Skills
          </Link>
          <Link href="/#contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link 
            href="/captcha-test" 
            className="mobile-captcha-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>🛡️ Captcha Test Lab</span>
            <span className="badge-new">NEW</span>
          </Link>
        </div>
      )}

      <style jsx>{`
        /* SOLID OPAQUE NAVBAR HEADER - NEVER BLEEDS SCROLLED CONTENT */
        .navbar-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 14px 0;
          transition: all 0.25s ease;
          background: rgba(7, 9, 14, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);
        }

        :global([data-theme="light"]) .navbar-header {
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .navbar-header.scrolled {
          padding: 10px 0;
          background: rgba(7, 9, 14, 0.98);
          border-bottom: 1px solid rgba(99, 102, 241, 0.35);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55);
        }

        :global([data-theme="light"]) .navbar-header.scrolled {
          background: #ffffff;
          border-bottom: 1px solid rgba(37, 99, 235, 0.25);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Brand Logo & Details */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.15rem;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          flex-shrink: 0;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .brand-status-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 1px;
        }

        .brand-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* CLEAR, HIGH-CONTRAST SEGMENTED NAVIGATION BAR */
        .nav-links-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-full);
          padding: 5px 8px;
          box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        :global([data-theme="light"]) .nav-links-bar {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .nav-item {
          padding: 8px 18px;
          color: #f8fafc;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          display: inline-flex;
          align-items: center;
        }

        :global([data-theme="light"]) .nav-item {
          color: #1e293b;
        }

        .nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        :global([data-theme="light"]) .nav-item:hover {
          color: #0f172a;
          background: #e2e8f0;
        }

        /* HIGHLY VISIBLE CAPTCHA TEST LINK */
        .captcha-nav-btn {
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: var(--radius-full);
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.45);
          margin-left: 4px;
        }

        .captcha-nav-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 24px rgba(245, 158, 11, 0.65);
          filter: brightness(1.1);
        }

        .active-captcha {
          background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important;
          border-color: #ffffff !important;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.7) !important;
        }

        .badge-new {
          background: #ffffff;
          color: #dc2626;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 6px;
          letter-spacing: 0.05em;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        /* Action Buttons */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .theme-toggle-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: var(--bg-surface-elevated);
          color: var(--text-main);
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        :global([data-theme="light"]) .theme-toggle-btn {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .theme-toggle-btn:hover {
          transform: rotate(20deg) scale(1.08);
          border-color: var(--primary);
        }

        .mobile-toggle-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface-elevated);
          color: var(--text-main);
          font-size: 1.3rem;
          cursor: pointer;
        }

        /* Mobile Menu */
        .mobile-menu-drawer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px 24px;
          background: var(--bg-surface);
          border-bottom: 2px solid var(--primary);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }

        .mobile-status-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-main);
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .mobile-link {
          color: var(--text-main);
          font-size: 1.05rem;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mobile-link:hover {
          background: var(--bg-surface-elevated);
          color: var(--primary);
        }

        .mobile-captcha-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: #ffffff;
          font-weight: 700;
          border-radius: var(--radius-full);
          text-decoration: none;
          margin-top: 6px;
        }

        .show-on-mobile {
          display: none;
        }

        @media (max-width: 980px) {
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
