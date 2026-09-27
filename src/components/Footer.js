import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">SC</div>
            <div>
              <h3>Suraj K. Chandurkar</h3>
              <p className="footer-tagline">Currently Working as Software Developer</p>
            </div>
          </div>
          
          <div className="footer-nav">
            <Link href="/#about">About</Link>
            <Link href="/#experience">Experience</Link>
            <Link href="/#projects">Projects</Link>
            <Link href="/#skills">Skills</Link>
            <Link href="/captcha-test" className="footer-captcha-link">
              🛡️ Captcha Test
            </Link>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Suraj K. Chandurkar. All rights reserved.</p>
          <div className="footer-badges">
            <span className="tech-badge">Built with React & Next.js</span>
            <span className="tech-badge">Vanilla CSS</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 60px 0 30px;
          margin-top: 80px;
          position: relative;
          z-index: 1;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .footer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo {
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
        }

        .footer-brand h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .footer-tagline {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .footer-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-nav a {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-nav a:hover {
          color: var(--text-main);
        }

        .footer-captcha-link {
          color: #f59e0b !important;
          font-weight: 600;
        }

        .footer-divider {
          height: 1px;
          background: var(--border-subtle);
          width: 100%;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: var(--text-subtle);
        }

        .footer-badges {
          display: flex;
          gap: 12px;
        }

        .tech-badge {
          padding: 4px 10px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }
      `}</style>
    </footer>
  );
}
