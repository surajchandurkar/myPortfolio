'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { playSound } from '../../lib/sound';
import { launchConfetti } from '../../lib/confetti';
import styles from './captcha.module.css';

// Character palette & colors for authentic captcha style
const CHAR_SET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LETTER_COLORS = [
  '#000000', // Black
  '#1e3a8a', // Deep Navy
  '#b91c1c', // Deep Crimson
  '#15803d', // Dark Green
  '#6b21a8', // Deep Purple
  '#1d4ed8', // Royal Blue
  '#c2410c', // Dark Orange
];

export default function CaptchaTestPage() {
  const [activeTab, setActiveTab] = useState('portal'); // 'portal' | 'canvas-lab' | 'batch'

  // Performance / Benchmark statistics
  const [stats, setStats] = useState({
    solved: 0,
    attempts: 0,
    streak: 0,
  });

  // ==========================================
  // TAB 1: CAPTCHA SIGN-IN CARD STATE
  // ==========================================
  const [portalCaptcha, setPortalCaptcha] = useState('');
  const [portalCharData, setPortalCharData] = useState([]);
  const [portalUsername, setPortalUsername] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [portalShowPassword, setPortalShowPassword] = useState(false);
  const [portalCodeInput, setPortalCodeInput] = useState('');
  const [portalTimer, setPortalTimer] = useState(115); // 1:55
  const [portalNotification, setPortalNotification] = useState(null);

  const generatePortalCaptcha = useCallback(() => {
    let code = '';
    const charData = [];
    for (let i = 0; i < 6; i++) {
      const char = CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
      code += char;
      const rotate = Math.floor(Math.random() * 24) - 12; // -12 to 12 deg
      const color = LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)];
      charData.push({ char, rotate, color });
    }
    setPortalCaptcha(code);
    setPortalCharData(charData);
    setPortalCodeInput('');
    setPortalNotification(null);
    setPortalTimer(115);
  }, []);

  // Portal Timer
  useEffect(() => {
    generatePortalCaptcha();
  }, [generatePortalCaptcha]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPortalTimer((prev) => {
        if (prev <= 1) {
          generatePortalCaptcha();
          return 115;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [generatePortalCaptcha]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePortalSubmit = (e) => {
    e.preventDefault();
    if (!portalCodeInput.trim()) return;

    setStats((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

    if (portalCodeInput.trim().toUpperCase() === portalCaptcha.toUpperCase()) {
      playSound('success');
      launchConfetti();
      setStats((prev) => ({
        ...prev,
        solved: prev.solved + 1,
        streak: prev.streak + 1,
      }));
      setPortalNotification({
        type: 'success',
        text: '✓ Access Granted: Credentials & CAPTCHA verified successfully.',
      });
      setTimeout(() => {
        generatePortalCaptcha();
      }, 3000);
    } else {
      playSound('error');
      setStats((prev) => ({ ...prev, streak: 0 }));
      setPortalNotification({
        type: 'error',
        text: '✕ Verification Failed: Invalid captcha code. Please try again.',
      });
    }
  };

  // ==========================================
  // TAB 2: ADVANCED CANVAS & OCR TEST LAB
  // ==========================================
  const canvasRef = useRef(null);
  const [labText, setLabText] = useState('7H8KX4');
  const [labCharCount, setLabCharCount] = useState(6);
  const [labNoiseLevel, setLabNoiseLevel] = useState('medium'); // 'none' | 'low' | 'medium' | 'high'
  const [labDistortion, setLabDistortion] = useState(15);
  const [labUserInput, setLabUserInput] = useState('');
  const [labResult, setLabResult] = useState(null);

  // OCR Pipeline Simulation State
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);
  const [ocrOutput, setOcrOutput] = useState('');

  const drawLabCanvas = useCallback((text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 360;
    const height = 110;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Background Noise Dots
    const dotCount = labNoiseLevel === 'none' ? 0 : labNoiseLevel === 'low' ? 30 : labNoiseLevel === 'medium' ? 80 : 160;
    for (let i = 0; i < dotCount; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Noise Lines (Wavy Bezier curves)
    const lineCount = labNoiseLevel === 'none' ? 0 : labNoiseLevel === 'low' ? 2 : labNoiseLevel === 'medium' ? 4 : 8;
    for (let i = 0; i < lineCount; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 180}, ${Math.random() * 180}, ${Math.random() * 180}, 0.5)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width * 0.2, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Render characters with rotation & distortion
    const charSpacing = width / (text.length + 1);
    ctx.font = 'bold 44px "JetBrains Mono", Consolas, monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = charSpacing * (i + 0.8);
      const y = height / 2 + (Math.random() * 10 - 5);
      const angle = ((Math.random() * labDistortion * 2 - labDistortion) * Math.PI) / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = LETTER_COLORS[i % LETTER_COLORS.length];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 3;
      ctx.fillText(char, -14, 0);
      ctx.restore();
    }
  }, [labDistortion, labNoiseLevel]);

  const generateLabCaptcha = useCallback(() => {
    let code = '';
    for (let i = 0; i < labCharCount; i++) {
      code += CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
    }
    setLabText(code);
    setLabUserInput('');
    setLabResult(null);
    setOcrStep(0);
    setOcrOutput('');
    drawLabCanvas(code);
  }, [drawLabCanvas, labCharCount]);

  useEffect(() => {
    if (activeTab === 'canvas-lab') {
      generateLabCaptcha();
    }
  }, [activeTab, generateLabCaptcha]);

  const handleCopyImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        playSound('click');
        alert('✓ CAPTCHA Image copied to clipboard! You can paste it into image tools or OCR test scripts.');
      } else {
        alert('Clipboard image copy is not supported in this browser.');
      }
    });
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `captcha-${labText}.png`;
    link.href = canvas.toDataURL();
    link.click();
    playSound('click');
  };

  const handleSpeakAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const spoken = labText.split('').join(' . ');
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    playSound('click');
  };

  // Simulate OCR Engine pipeline (Binarize -> Segmentation -> Classification)
  const handleRunOcrSimulation = () => {
    if (ocrRunning) return;
    setOcrRunning(true);
    setOcrStep(1);
    playSound('click');

    setTimeout(() => {
      setOcrStep(2); // Grayscale & Noise Thresholding
      setTimeout(() => {
        setOcrStep(3); // Contour Segmentation
        setTimeout(() => {
          setOcrStep(4); // Classification Completed
          setOcrOutput(labText);
          setOcrRunning(false);
          playSound('success');
        }, 600);
      }, 600);
    }, 600);
  };

  const handleLabVerify = (e) => {
    e.preventDefault();
    if (!labUserInput.trim()) return;

    setStats((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

    if (labUserInput.trim().toUpperCase() === labText.toUpperCase()) {
      playSound('success');
      launchConfetti();
      setStats((prev) => ({
        ...prev,
        solved: prev.solved + 1,
        streak: prev.streak + 1,
      }));
      setLabResult({ success: true, text: '✓ Verified Correct! Match 100%' });
      setTimeout(() => {
        generateLabCaptcha();
      }, 2000);
    } else {
      playSound('error');
      setStats((prev) => ({ ...prev, streak: 0 }));
      setLabResult({ success: false, text: '✕ Verification Failed. Expected: ' + labText });
    }
  };

  // ==========================================
  // TAB 3: BATCH BENCHMARK CODES
  // ==========================================
  const [batchCodes, setBatchCodes] = useState([]);

  const generateBatchCodes = useCallback(() => {
    const list = [];
    for (let b = 0; b < 6; b++) {
      let code = '';
      const chars = [];
      for (let i = 0; i < 6; i++) {
        const c = CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
        code += c;
        chars.push({
          c,
          rotate: Math.floor(Math.random() * 20) - 10,
          color: LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)],
        });
      }
      list.push({ id: b, code, chars });
    }
    setBatchCodes(list);
  }, []);

  useEffect(() => {
    if (activeTab === 'batch') {
      generateBatchCodes();
    }
  }, [activeTab, generateBatchCodes]);

  const accuracyRate =
    stats.attempts > 0 ? Math.round((stats.solved / stats.attempts) * 100) : 100;

  return (
    <>
      <Navbar />

      <main className={styles.pageWrapper}>
        <div className="container">
          {/* Top Breadcrumb & Live Benchmark Statistics */}
          <div className={styles.topNav}>
            <Link href="/" className={styles.backBtn} id="back-to-portfolio-link">
              <span>←</span>
              <span>Back to Portfolio</span>
            </Link>

            <div className={styles.statsBar}>
              <div className={styles.statPill}>
                <span>Solved:</span>
                <strong>{stats.solved}</strong>
              </div>
              <div className={styles.statPill}>
                <span>Attempts:</span>
                <strong>{stats.attempts}</strong>
              </div>
              <div className={styles.statPill}>
                <span>Accuracy:</span>
                <strong style={{ color: accuracyRate > 75 ? '#10b981' : '#f59e0b' }}>
                  {accuracyRate}%
                </strong>
              </div>
              <div className={styles.statPill}>
                <span>Streak:</span>
                <strong style={{ color: '#6366f1' }}>🔥 {stats.streak}</strong>
              </div>
            </div>
          </div>

          {/* Banner Title */}
          <div className={styles.banner}>
            <div className={styles.bannerTag}>
              <span>🛡️ Security Verification & OCR Test Laboratory</span>
            </div>
            <h1 className={styles.bannerTitle}>Interactive Captcha Test Suite</h1>
            <p className={styles.bannerDesc}>
              Test, evaluate, and benchmark human verification challenges, OCR recognition pipelines,
              and authentic portal authentication flows.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className={styles.tabsContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'portal' ? styles.activeTab : ''}`}
              onClick={() => {
                setActiveTab('portal');
                playSound('click');
              }}
              id="tab-portal-simulation"
            >
              <span>🛡️</span>
              <span>Captcha Sign-In Card</span>
            </button>

            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'canvas-lab' ? styles.activeTab : ''}`}
              onClick={() => {
                setActiveTab('canvas-lab');
                playSound('click');
              }}
              id="tab-canvas-lab"
            >
              <span>🔬</span>
              <span>Canvas & OCR Engine Sandbox</span>
            </button>

            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'batch' ? styles.activeTab : ''}`}
              onClick={() => {
                setActiveTab('batch');
                playSound('click');
              }}
              id="tab-batch-grid"
            >
              <span>⚡</span>
              <span>Batch Extension Benchmark</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: CLEAN SNIPPED CAPTCHA CARD (LIVE TEST)
              ======================================================== */}
          {activeTab === 'portal' && (
            <div className={styles.portalCardWrapper}>
              <div className={styles.signInHeader}>
                    <div className={styles.signInTitleRow}>
                      <span className={styles.shieldIcon}>🛡️</span>
                      <span>Sign In</span>
                    </div>
                    <p>Please enter your credentials to access the portal.</p>
                  </div>

                  <form onSubmit={handlePortalSubmit} className={styles.portalForm}>
                    {/* Username Input */}
                    <div className={styles.portalInputGroup}>
                      <span className={styles.inputIcon}>👤</span>
                      <input
                        type="text"
                        placeholder="Username"
                        value={portalUsername}
                        onChange={(e) => setPortalUsername(e.target.value)}
                        className={styles.portalInput}
                        id="portal-username"
                      />
                    </div>

                    {/* Password Input */}
                    <div className={styles.portalInputGroup}>
                      <span className={styles.inputIcon}>🔒</span>
                      <input
                        type={portalShowPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                        className={styles.portalInput}
                        id="portal-password"
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setPortalShowPassword(!portalShowPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {portalShowPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>

                    {/* AUTHENTIC CAPTCHA DISPLAY BOX */}
                    <div className={styles.authenticCaptchaBox} id="authentic-captcha-box">
                      <div className={styles.captchaCharsRow}>
                        {portalCharData.map((item, idx) => (
                          <span
                            key={idx}
                            className={styles.authenticChar}
                            style={{
                              transform: `rotate(${item.rotate}deg)`,
                              color: item.color,
                            }}
                          >
                            {item.char}
                          </span>
                        ))}
                      </div>

                      <div className={styles.captchaSideControls}>
                        <button
                          type="button"
                          className={styles.portalRefreshBtn}
                          onClick={() => {
                            playSound('click');
                            generatePortalCaptcha();
                          }}
                          title="Refresh Captcha"
                          aria-label="Refresh Captcha code"
                          id="portal-captcha-refresh"
                        >
                          🔄
                        </button>

                        <div
                          className={`${styles.portalTimerBadge} ${portalTimer <= 30 ? styles.timerWarning : ''
                            }`}
                          title="Time remaining before auto-regeneration"
                        >
                          {formatTimer(portalTimer)}
                        </div>
                      </div>
                    </div>

                    {/* Captcha Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Enter the code shown above"
                        value={portalCodeInput}
                        onChange={(e) => setPortalCodeInput(e.target.value)}
                        className={styles.portalCodeInput}
                        maxLength={8}
                        autoComplete="off"
                        id="portal-captcha-input"
                      />
                    </div>

                    {/* Remember me & Forgot */}
                    <div className={styles.formOptionsRow}>
                      <label className={styles.rememberMe}>
                        <input type="checkbox" id="portal-remember-me" />
                        <span>Remember username</span>
                      </label>
                      <a href="#forgot" className={styles.forgotLink}>
                        Forgot Password?
                      </a>
                    </div>

                    {/* Feedback Notification */}
                    {portalNotification && (
                      <div
                        className={`${styles.portalNotification} ${portalNotification.type === 'success'
                            ? styles.notifySuccess
                            : styles.notifyError
                          }`}
                      >
                        {portalNotification.text}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className={styles.signInBtn} id="portal-sign-in-btn">
                      <span>Sign In</span>
                      <span>→</span>
                    </button>
                  </form>
            </div>
          )}

          {/* ========================================================
              TAB 2: ADVANCED CANVAS & OCR ENGINE SANDBOX
              ======================================================== */}
          {activeTab === 'canvas-lab' && (
            <div className={styles.ocrLabGrid}>
              {/* Canvas Generator Column */}
              <div className={`glass-card ${styles.canvasCard}`}>
                <div className={styles.canvasHeader}>
                  <h3>Dynamic Canvas CAPTCHA</h3>
                  <button
                    type="button"
                    onClick={generateLabCaptcha}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    <span>Regenerate</span>
                    <span>🔄</span>
                  </button>
                </div>

                <div className={styles.canvasAreaWrapper}>
                  <canvas ref={canvasRef} className={styles.mainCanvas} />
                </div>

                <div className={styles.canvasActionsRow}>
                  <button type="button" onClick={handleCopyImage} className={styles.actionBtn}>
                    <span>📋</span>
                    <span>Copy Image</span>
                  </button>
                  <button type="button" onClick={handleDownloadImage} className={styles.actionBtn}>
                    <span>💾</span>
                    <span>Download PNG</span>
                  </button>
                  <button type="button" onClick={handleSpeakAudio} className={styles.actionBtn}>
                    <span>🔊</span>
                    <span>Listen Audio</span>
                  </button>
                </div>

                {/* Live Form Verification */}
                <form onSubmit={handleLabVerify} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={labUserInput}
                    onChange={(e) => setLabUserInput(e.target.value)}
                    placeholder="Verify code here..."
                    className={styles.portalCodeInput}
                    maxLength={10}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                    Verify
                  </button>
                </form>

                {labResult && (
                  <div
                    className={`${styles.portalNotification} ${labResult.success ? styles.notifySuccess : styles.notifyError
                      }`}
                  >
                    {labResult.text}
                  </div>
                )}

                {/* Generator Settings Controls */}
                <div className={styles.controlsBox}>
                  <div className={styles.controlRow}>
                    <label>Length: {labCharCount} chars</label>
                    <input
                      type="range"
                      min={4}
                      max={8}
                      value={labCharCount}
                      onChange={(e) => setLabCharCount(Number(e.target.value))}
                      className={styles.rangeSlider}
                    />
                  </div>

                  <div className={styles.controlRow}>
                    <label>Noise Level:</label>
                    <select
                      value={labNoiseLevel}
                      onChange={(e) => setLabNoiseLevel(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="none">None (Clean)</option>
                      <option value="low">Low (Light dots)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="high">High (Heavy lines & noise)</option>
                    </select>
                  </div>

                  <div className={styles.controlRow}>
                    <label>Distortion Angle: ±{labDistortion}°</label>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={labDistortion}
                      onChange={(e) => setLabDistortion(Number(e.target.value))}
                      className={styles.rangeSlider}
                    />
                  </div>
                </div>
              </div>

              {/* OCR Engine Simulation Panel */}
              <div className={`glass-card ${styles.ocrPanel}`}>
                <div className={styles.ocrHeader}>
                  <span className={styles.ocrIcon}>🤖</span>
                  <div>
                    <h3>OCR Engine Pipeline Inspector</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Simulates client-side optical character recognition (similar to ocr-engine.js)
                    </p>
                  </div>
                </div>

                <div className={styles.ocrPipelineSteps}>
                  <div className={styles.pipelineStep}>
                    <span className={styles.stepTitle}>1. Image Preprocessing & Grayscale</span>
                    <span
                      className={`${styles.stepStatus} ${ocrStep >= 1 ? styles.statusSuccess : styles.statusPending
                        }`}
                    >
                      {ocrStep >= 1 ? '✓ COMPLETE' : 'WAITING'}
                    </span>
                  </div>

                  <div className={styles.pipelineStep}>
                    <span className={styles.stepTitle}>2. Binarization & Adaptive Thresholding</span>
                    <span
                      className={`${styles.stepStatus} ${ocrStep >= 2 ? styles.statusSuccess : styles.statusPending
                        }`}
                    >
                      {ocrStep >= 2 ? '✓ COMPLETE' : 'WAITING'}
                    </span>
                  </div>

                  <div className={styles.pipelineStep}>
                    <span className={styles.stepTitle}>3. Contour Detection & Segmentation</span>
                    <span
                      className={`${styles.stepStatus} ${ocrStep >= 3 ? styles.statusSuccess : styles.statusPending
                        }`}
                    >
                      {ocrStep >= 3 ? '✓ COMPLETE' : 'WAITING'}
                    </span>
                  </div>

                  <div className={styles.pipelineStep}>
                    <span className={styles.stepTitle}>4. Character Classification</span>
                    <span
                      className={`${styles.stepStatus} ${ocrStep >= 4 ? styles.statusSuccess : styles.statusPending
                        }`}
                    >
                      {ocrStep >= 4 ? '✓ COMPLETE' : 'WAITING'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRunOcrSimulation}
                  disabled={ocrRunning}
                  style={{ width: '100%' }}
                >
                  {ocrRunning ? 'Running OCR Pipeline...' : '⚡ Run OCR Recognition Test'}
                </button>

                {ocrOutput && (
                  <div className={styles.ocrResultCard}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Detected Text Output:
                    </span>
                    <div className={styles.ocrResultText}>{ocrOutput}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setLabUserInput(ocrOutput);
                          playSound('click');
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      >
                        Auto-fill into Verification Input
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: BATCH BENCHMARK CODES GRID
              ======================================================== */}
          {activeTab === 'batch' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
                <button type="button" onClick={generateBatchCodes} className="btn btn-primary">
                  <span>Regenerate All Captchas</span>
                  <span>🔄</span>
                </button>
              </div>

              <div className={styles.batchGrid}>
                {batchCodes.map((item, idx) => (
                  <div key={item.id} className={`glass-card ${styles.batchItemCard}`}>
                    <div className={styles.batchBadge}>Test Sample #{idx + 1}</div>

                    <div className={styles.authenticCaptchaBox} style={{ width: '100%' }}>
                      <div className={styles.captchaCharsRow}>
                        {item.chars.map((cObj, cIdx) => (
                          <span
                            key={cIdx}
                            className={styles.authenticChar}
                            style={{
                              transform: `rotate(${cObj.rotate}deg)`,
                              color: cObj.color,
                              fontSize: '1.4rem',
                            }}
                          >
                            {cObj.c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(item.code);
                            playSound('click');
                            alert(`Copied text: ${item.code}`);
                          }
                        }}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                      >
                        Copy Text
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPortalCaptcha(item.code);
                          setPortalCharData(
                            item.chars.map((c) => ({
                              char: c.c,
                              rotate: c.rotate,
                              color: c.color,
                            }))
                          );
                          setActiveTab('portal');
                          playSound('click');
                        }}
                        className="btn btn-captcha"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                      >
                        Load in Portal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
