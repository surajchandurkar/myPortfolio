'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { playSound } from '../lib/sound';
import { launchConfetti } from '../lib/confetti';
import styles from './page.module.css';

// Pre-defined realistic colors for characters (inspired by the screenshot)
const CAPTCHA_COLORS = ['#1e3a8a', '#b91c1c', '#047857', '#6d28d9', '#c2410c', '#0f766e', '#1d4ed8'];

export default function HomePage() {
  // Mini CAPTCHA widget state on homepage
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [charStyles, setCharStyles] = useState([]);
  const [timeLeft, setTimeLeft] = useState(115); // 1:55 like the screenshot!

  // Form contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  // Generate new mini CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    const newStyles = [];
    for (let i = 0; i < 6; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      code += char;
      const rotate = Math.floor(Math.random() * 26) - 13;
      const color = CAPTCHA_COLORS[Math.floor(Math.random() * CAPTCHA_COLORS.length)];
      newStyles.push({ rotate, color });
    }
    setCaptchaCode(code);
    setCharStyles(newStyles);
    setUserInput('');
    setFeedback(null);
    setTimeLeft(115);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateCaptcha();
          return 115;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (userInput.trim().toUpperCase() === captchaCode.toUpperCase()) {
      playSound('success');
      launchConfetti();
      setFeedback({ type: 'success', message: '✓ Captcha Verified Successfully! Great job.' });
      setTimeout(() => {
        generateCaptcha();
      }, 2500);
    } else {
      playSound('error');
      setFeedback({ type: 'error', message: '✕ Verification failed. Incorrect code.' });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    playSound('success');
    setFormSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setFormSent(false);
    }, 4000);
  };

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                {/* Live Status Pill */}
                <div className={styles.statusPill}>
                  <span className="pulse-dot" />
                  <span>Currently Active & Coding</span>
                </div>

                {/* 1. EXACT REQUIRED HEADING */}
                <h1 className={styles.heroHeading} id="main-heading">
                  Suraj K. Chandurkar <br />
                  <span className="gradient-text">personal Web Page</span>
                </h1>

                {/* 2. EXACT REQUIRED SUBTITLE */}
                <div className={styles.heroSubtitle}>
                  <span className={styles.roleHighlight}>Currently Working as Software Developer</span>
                </div>

                <p className={styles.heroDescription}>
                  Full-stack software developer building robust web applications, 
                  high-precision OCR pipelines, and seamless user experiences. 
                  Specializing in React, Next.js, automated testing algorithms, and security verifications.
                </p>

                {/* Action CTAs including the NEW LINK WITH CAPTCHA TEST */}
                <div className={styles.heroActions}>
                  {/* The requested new link with captcha test */}
                  <Link 
                    href="/captcha-test" 
                    className={styles.captchaHeroBtn}
                    id="hero-captcha-test-link"
                  >
                    <span className={styles.sparkle}>🛡️</span>
                    <span>Launch Captcha Test Lab</span>
                    <span className={styles.btnNewBadge}>NEW</span>
                  </Link>

                  <a href="#projects" className={styles.secondaryBtn}>
                    <span>View Projects</span>
                    <span>↓</span>
                  </a>

                  <a href="#contact" className={styles.secondaryBtn}>
                    <span>Get In Touch</span>
                    <span>✉</span>
                  </a>
                </div>
              </div>

              {/* Hero Visual Card with Avatar */}
              <div className={styles.heroVisual}>
                <div className={styles.avatarCard}>
                  <div className={styles.floatingBadgeTop}>
                    <span>💻</span>
                    <span>Software Developer</span>
                  </div>

                  <div className={styles.imageWrapper}>
                    <Image
                      src="/avatar.jpg"
                      alt="Suraj K. Chandurkar"
                      width={440}
                      height={440}
                      priority
                      className={styles.avatarImg}
                    />
                  </div>

                  <div className={styles.floatingBadgeBottom}>
                    <span>⚡</span>
                    <span>Captcha & OCR Test Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK CAPTCHA TEST TEASER & DIRECT LINK HIGHLIGHT */}
        <section className={styles.quickCaptchaSection}>
          <div className="container">
            <div className={styles.quickCaptchaCard}>
              <div className={styles.quickCaptchaInfo}>
                <span className="pill-badge" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                  🛡️ Featured Security Tool
                </span>
                <h3 style={{ marginTop: '12px' }}>Interactive Captcha Test Suite</h3>
                <p>
                  Experience the authentic interactive CAPTCHA verification engine with real-time countdown timer and styled character testing. 
                  Designed to test OCR accuracy, browser extensions, and human verification resilience.
                </p>
                <Link 
                  href="/captcha-test" 
                  className="btn btn-captcha"
                  id="teaser-captcha-link"
                >
                  <span>Open Full Captcha Testing Lab</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Interactive Mini Captcha Widget */}
              <div className={styles.quickCaptchaWidget}>
                <div className={styles.captchaDisplayBox}>
                  <div className={styles.captchaLetters} aria-label="Captcha letters">
                    {charStyles.map((style, idx) => (
                      <span
                        key={idx}
                        className={styles.captchaLetter}
                        style={{
                          transform: `rotate(${style.rotate}deg)`,
                          color: style.color,
                        }}
                      >
                        {captchaCode[idx]}
                      </span>
                    ))}
                  </div>

                  <div className={styles.captchaControls}>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        generateCaptcha();
                      }}
                      className={styles.refreshIconBtn}
                      title="Reload Captcha"
                      aria-label="Refresh Captcha"
                    >
                      🔄
                    </button>
                    <div className={styles.timerPill} title="Time until auto-refresh">
                      {formatTimer(timeLeft)}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerify} className={styles.inputGroup}>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter code above"
                    className={styles.captchaInput}
                    maxLength={8}
                    autoComplete="off"
                    aria-label="Enter captcha code"
                  />
                  <button type="submit" className={styles.verifyBtn}>
                    Verify
                  </button>
                </form>

                {feedback && (
                  <div
                    className={`${styles.captchaFeedback} ${
                      feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className={styles.aboutSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>About Me</span>
              <h2 className={styles.sectionTitle}>Crafting High-Performance Web Systems</h2>
              <p className={styles.sectionSubtitle}>
                A dedicated software developer focused on architecting resilient, user-centric software.
              </p>
            </div>

            <div className={styles.aboutGrid}>
              <div className={`glass-card ${styles.aboutCard}`}>
                <h3>Hello, I&apos;m Suraj K. Chandurkar</h3>
                <p>
                  I am a passionate <strong>Software Developer</strong> specializing in creating modern, scalable web applications, 
                  microservices, and automation workflows. My development philosophy focuses on clean code, performant architecture, 
                  and intuitive user interfaces.
                </p>
                <p>
                  With experience spanning full-stack web development and specialized systems like 
                  OCR (Optical Character Recognition) engines, browser extension engineering, and authentication security, 
                  I turn complex engineering challenges into fluid digital experiences.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/captcha-test" className="btn btn-secondary">
                    <span>Explore My Captcha Test Suite</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>Clean Code Commitment</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>Full Stack</span>
                  <span className={styles.statLabel}>React & Next.js Architecture</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>OCR & AI</span>
                  <span className={styles.statLabel}>Computer Vision & Automation</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>Security</span>
                  <span className={styles.statLabel}>Portal Verification Systems</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className={styles.projectsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Featured Work</span>
              <h2 className={styles.sectionTitle}>Engineered Projects & Systems</h2>
              <p className={styles.sectionSubtitle}>
                A showcase of software systems, security testing tools, and scalable web solutions.
              </p>
            </div>

            <div className={styles.projectsGrid}>
              {/* Project 1: Captcha Test Lab (Featured) */}
              <div className={`glass-card ${styles.projectCard} ${styles.projectCardFeatured}`}>
                <div className={styles.featuredPill}>FEATURED LAB</div>
                <div className={styles.projectHeader}>
                  <span className={styles.projectIcon}>🛡️</span>
                  <h3>Captcha Test & OCR Benchmark Lab</h3>
                </div>
                <p className={styles.projectDesc}>
                  A comprehensive interactive testing suite replicating authentic styled captchas, 
                  canvas-distorted challenges, mathematical verification, and OCR evaluation sandbox.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.techPill}>React</span>
                  <span className={styles.techPill}>HTML5 Canvas</span>
                  <span className={styles.techPill}>OCR Engine</span>
                  <span className={styles.techPill}>Audio API</span>
                </div>
                <Link href="/captcha-test" className={styles.projectActionLink}>
                  <span>Launch Live Test Suite</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Project 2: Secure Authentication & Captcha Gate */}
              <div className={`glass-card ${styles.projectCard}`}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectIcon}>🔐</span>
                  <h3>Secure Authentication & Captcha Gate</h3>
                </div>
                <p className={styles.projectDesc}>
                  Enterprise authentication interface featuring dynamic CAPTCHA challenge generation, 
                  rate-limiting protection, session timeouts, and anti-bot verification.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.techPill}>Next.js</span>
                  <span className={styles.techPill}>TypeScript</span>
                  <span className={styles.techPill}>REST API</span>
                  <span className={styles.techPill}>Security</span>
                </div>
                <Link href="/captcha-test" className={styles.projectActionLink}>
                  <span>View Authentication Demo</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Project 3: Client-side OCR Engine & Browser Extension */}
              <div className={`glass-card ${styles.projectCard}`}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectIcon}>🔍</span>
                  <h3>Automated OCR & Vision Engine</h3>
                </div>
                <p className={styles.projectDesc}>
                  Chrome extension (Manifest V3) and client-side optical character recognition pipeline 
                  utilizing image binarization, noise thresholding, and contour segmentation algorithms.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.techPill}>JavaScript</span>
                  <span className={styles.techPill}>Manifest V3</span>
                  <span className={styles.techPill}>Image Processing</span>
                  <span className={styles.techPill}>Canvas</span>
                </div>
                <Link href="/captcha-test" className={styles.projectActionLink}>
                  <span>Test OCR Algorithm</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Project 4: Cloud Enterprise Dashboard */}
              <div className={`glass-card ${styles.projectCard}`}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectIcon}>📊</span>
                  <h3>Real-Time Analytics Platform</h3>
                </div>
                <p className={styles.projectDesc}>
                  Interactive web application with instant data visualization, responsive glassmorphism charts, 
                  and high-throughput event processing.
                </p>
                <div className={styles.projectTechs}>
                  <span className={styles.techPill}>React 19</span>
                  <span className={styles.techPill}>Next.js</span>
                  <span className={styles.techPill}>Vanilla CSS</span>
                  <span className={styles.techPill}>WebSockets</span>
                </div>
                <a href="#contact" className={styles.projectActionLink}>
                  <span>Request Case Study</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className={styles.skillsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Capabilities</span>
              <h2 className={styles.sectionTitle}>Technical Toolkit</h2>
              <p className={styles.sectionSubtitle}>
                Technologies and tools I leverage daily as a Software Developer.
              </p>
            </div>

            <div className={styles.skillsGrid}>
              <div className={`glass-card ${styles.skillCategoryCard}`}>
                <div className={styles.skillCatHeader}>
                  <div className={styles.skillCatIcon}>⚡</div>
                  <h3>Frontend Development</h3>
                </div>
                <div className={styles.skillPills}>
                  <span className={styles.skillTag}>React 19</span>
                  <span className={styles.skillTag}>Next.js (App Router)</span>
                  <span className={styles.skillTag}>JavaScript (ESNext)</span>
                  <span className={styles.skillTag}>TypeScript</span>
                  <span className={styles.skillTag}>HTML5 & Semantic DOM</span>
                  <span className={styles.skillTag}>Vanilla CSS3 & Flex/Grid</span>
                  <span className={styles.skillTag}>HTML5 Canvas API</span>
                </div>
              </div>

              <div className={`glass-card ${styles.skillCategoryCard}`}>
                <div className={styles.skillCatHeader}>
                  <div className={styles.skillCatIcon}>⚙️</div>
                  <h3>Backend & APIs</h3>
                </div>
                <div className={styles.skillPills}>
                  <span className={styles.skillTag}>Node.js</span>
                  <span className={styles.skillTag}>Express</span>
                  <span className={styles.skillTag}>RESTful APIs</span>
                  <span className={styles.skillTag}>Authentication (JWT/OAuth)</span>
                  <span className={styles.skillTag}>JSON / Data Schemas</span>
                  <span className={styles.skillTag}>SQL & NoSQL</span>
                </div>
              </div>

              <div className={`glass-card ${styles.skillCategoryCard}`}>
                <div className={styles.skillCatHeader}>
                  <div className={styles.skillCatIcon}>🛡️</div>
                  <h3>Security & Automation</h3>
                </div>
                <div className={styles.skillPills}>
                  <span className={styles.skillTag}>CAPTCHA Architecture</span>
                  <span className={styles.skillTag}>OCR Recognition</span>
                  <span className={styles.skillTag}>Chrome Extension (V3)</span>
                  <span className={styles.skillTag}>DOM Scraping & Automation</span>
                  <span className={styles.skillTag}>Input Sanitization</span>
                  <span className={styles.skillTag}>Web Security Standards</span>
                </div>
              </div>

              <div className={`glass-card ${styles.skillCategoryCard}`}>
                <div className={styles.skillCatHeader}>
                  <div className={styles.skillCatIcon}>🛠️</div>
                  <h3>Tools & Workflow</h3>
                </div>
                <div className={styles.skillPills}>
                  <span className={styles.skillTag}>Git & GitHub</span>
                  <span className={styles.skillTag}>VS Code & Antigravity</span>
                  <span className={styles.skillTag}>Chrome DevTools</span>
                  <span className={styles.skillTag}>npm / package management</span>
                  <span className={styles.skillTag}>CI / CD Pipelines</span>
                  <span className={styles.skillTag}>Performance Profiling</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className={styles.experienceSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Career Path</span>
              <h2 className={styles.sectionTitle}>Professional Experience</h2>
              <p className={styles.sectionSubtitle}>
                Currently working actively as a Software Developer.
              </p>
            </div>

            <div className={styles.timeline}>
              <div className={`glass-card ${styles.timelineCard}`}>
                <div className={styles.timelineIconBox}>💼</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h3>Software Developer</h3>
                    <span className={styles.timelinePeriod}>Present</span>
                  </div>
                  <div className={styles.timelineCompany}>Currently Active Role</div>
                  <ul className={styles.timelinePoints}>
                    <li>Developing modern responsive web applications using React and Next.js.</li>
                    <li>Designing secure authentication workflows, verification algorithms, and dynamic CAPTCHA components.</li>
                    <li>Building automation scripts, Chrome extensions (Manifest V3), and client-side OCR parsing routines.</li>
                    <li>Ensuring high performance, cross-browser compatibility, and seamless user experiences.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className={styles.contactSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Get In Touch</span>
              <h2 className={styles.sectionTitle}>Let&apos;s Connect & Build</h2>
              <p className={styles.sectionSubtitle}>
                Have a question, collaboration idea, or need custom software developed? Reach out anytime!
              </p>
            </div>

            <div className={styles.contactGrid}>
              <div className={`glass-card ${styles.contactInfoCard}`}>
                <h3>Contact Information</h3>
                <p>
                  Feel free to send a message or explore my CAPTCHA testing lab to see interactive systems in action.
                </p>

                <div className={styles.contactMethods}>
                  <div className={styles.contactItem}>
                    <span>👤</span>
                    <div>
                      <strong>Suraj K. Chandurkar</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Software Developer</div>
                    </div>
                  </div>

                  <a href="mailto:suraj@example.com" className={styles.contactItem}>
                    <span>✉️</span>
                    <div>
                      <strong>Email</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send a direct email</div>
                    </div>
                  </a>

                  <Link href="/captcha-test" className={styles.contactItem} style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                    <span>🛡️</span>
                    <div>
                      <strong style={{ color: '#f59e0b' }}>Captcha Test Suite</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visit the interactive lab</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Message Simulator Form */}
              <div className={`glass-card ${styles.contactFormCard}`}>
                <form onSubmit={handleSendMessage} className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className={styles.formInput}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="contact-email">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      className={styles.formInput}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="contact-msg">Message</label>
                    <textarea
                      id="contact-msg"
                      required
                      placeholder="Tell me about your project or inquiry..."
                      className={styles.formTextarea}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    {formSent ? '✓ Message Sent Successfully!' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
