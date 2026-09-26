import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { pipelineSteps } from '../../data';

export default function Hero({ isReady = false }) {
  const [activePipelineIndex, setActivePipelineIndex] = useState(0);
  const heroRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Hero Cinematic Landing Animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = heroRef.current;
    if (!hero) return;

    if (prefersReduced) {
      // Ensure all elements are fully visible immediately
      gsap.set(
        hero.querySelectorAll(
          '.hero-line-inner, .eyebrow, .hero-copy p, .primary-hero-btn, .secondary-hero-btn, .credibility-pill, .growth-pipeline-wrap, .pipeline-node, .type-line, .hero-footer-bar'
        ),
        { opacity: 1, y: 0, yPercent: 0, scale: 1, rotateZ: 0 }
      );
      return;
    }

    const runLandingAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Eyebrow signal
      tl.fromTo(
        hero.querySelector('.eyebrow'),
        { opacity: 0, y: -16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65 }
      );

      // 2. Kinetic masked line reveals (LIRCLE & Jamie McKaye style)
      tl.fromTo(
        hero.querySelectorAll('.hero-line-inner'),
        { yPercent: 120, opacity: 0, rotateZ: 1.6 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.15,
          stagger: 0.15,
          ease: 'power4.out'
        },
        '-=0.42'
      );

      // 3. Hero paragraph subcopy
      tl.fromTo(
        hero.querySelectorAll('.hero-copy p'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '-=0.7'
      );

      // 4. Hero action buttons and credibility badge
      tl.fromTo(
        hero.querySelectorAll('.primary-hero-btn, .secondary-hero-btn, .credibility-pill'),
        { opacity: 0, y: 18, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'back.out(1.4)' },
        '-=0.6'
      );

      // 5. Growth pipeline container
      tl.fromTo(
        hero.querySelector('.growth-pipeline-wrap'),
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.5'
      );

      // 6. Pipeline nodes cascade in sequentially
      tl.fromTo(
        hero.querySelectorAll('.pipeline-node'),
        { opacity: 0, scale: 0.88, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.3)' },
        '-=0.55'
      );

      // 7. Core principle and footer coordinate bar
      tl.fromTo(
        hero.querySelector('.type-line'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.35'
      );

      tl.fromTo(
        hero.querySelector('.hero-footer-bar'),
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.35'
      );
    };

    if (isReady) {
      runLandingAnimation();
    } else {
      // Safety timeout: ensure animation runs even if preloader is skipped or delayed
      const fallbackTimer = setTimeout(() => {
        runLandingAnimation();
      }, 1600);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isReady]);

  // Subtle breathing ambient orb animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const hero = heroRef.current;
    if (!hero) return;

    const orb1 = gsap.to(hero.querySelector('.orb-one'), {
      scale: 1.15,
      x: 25,
      y: -20,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    const orb2 = gsap.to(hero.querySelector('.orb-two'), {
      scale: 1.2,
      x: -25,
      y: 25,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      orb1.kill();
      orb2.kill();
    };
  }, []);

  // Growth Pipeline Node Cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePipelineIndex((prev) => (prev + 1) % pipelineSteps.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="orb orb-one" aria-hidden="true"></div>
      <div className="orb orb-two" aria-hidden="true"></div>

      <div className="hero-content">
        <div className="eyebrow">
          <span className="section-num">01</span>
          <span className="slash">/</span>
          <span className="label-name">Signal</span>
          <em>[ Digital Growth Agency · Brand · Creative · Technology · Performance ]</em>
        </div>

        <h1 className="split-title hero-headline">
          <span className="hero-line-mask">
            <span className="hero-line-inner">WE DON'T JUST</span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line-inner hero-highlight">BUILD BRANDS.</span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line-inner">WE BUILD GROWTH SYSTEMS.</span>
          </span>
        </h1>

        <div className="hero-bottom">
          <div className="hero-copy">
            <p>
              Cyption is a digital growth agency helping ambitious businesses build stronger brands, reach the right audience and turn attention into measurable business growth.
            </p>
            <p>
              From branding and content to websites, SEO, performance marketing and conversion strategy, we bring everything together under one growth-focused system.
            </p>
          </div>
          <div className="hero-actions-panel">
            <div className="hero-ctas">
              <a href="#audit" className="cta-button primary-hero-btn magnetic">
                <span className="btn-bracket">[</span> Start Your Growth Journey <span className="btn-bracket">]</span> <span>↗</span>
              </a>
              <a href="#case-studies" className="secondary-hero-btn magnetic">
                Explore Our Work <span>↓</span>
              </a>
            </div>
            <div className="credibility-pill">
              <span className="cred-pulse"></span>
              <span className="cred-text">Brand Strategy · Creative · Technology · Performance</span>
            </div>
          </div>
        </div>

        {/* Animated Growth Pipeline Visualizer */}
        <div className="growth-pipeline-wrap" aria-label="Cyption Connected Growth Pipeline">
          <div className="pipeline-label">
            The Connected Growth Pipeline <b>●</b> Live Architecture
          </div>
          <div className="pipeline-track">
            {pipelineSteps.map((step, idx) => (
              <React.Fragment key={step.name}>
                <div
                  className={`pipeline-node ${activePipelineIndex === idx ? 'active' : ''} ${step.highlight ? 'highlight' : ''}`}
                  data-step={step.num}
                  onClick={() => setActivePipelineIndex(idx)}
                >
                  <span className="node-tag">{step.num}</span>
                  <strong className="node-name">{step.name}</strong>
                  <span className="node-desc">{step.desc}</span>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="pipeline-arrow" aria-hidden="true">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="type-line">
          CORE PRINCIPLE // <span>"WE BUILD THE SYSTEM THAT HELPS IT GROW"</span><b>_</b>
        </div>
      </div>

      <div className="hero-footer-bar">
        <div className="scroll-cue"><span></span> Scroll to discover</div>
        <div className="hero-index">KOL / <b>22.5726° N, 88.3639° E</b></div>
      </div>
    </section>
  );
}
