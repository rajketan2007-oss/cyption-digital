import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Common Layout & UI Components
import {
  Preloader,
  CustomCursor,
  Navbar,
  Footer
} from './components/common';

// Page Section Components
import {
  Hero,
  TrustStrip,
  Problem,
  WhatWeDo,
  WhyCyption,
  CaseStudies,
  Services,
  WhoWeWorkWith,
  GrowthSystem,
  Portfolio,
  Testimonials,
  GrowthAudit,
  FAQ,
  FinalCTA
} from './components/sections';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Smooth Scrolling with Lenis
    let lenis = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        lerp: isTouchDevice ? 0.12 : window.innerWidth < 1024 ? 0.1 : 0.085,
        smoothWheel: true,
        syncTouch: false
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor Smooth Scrolling
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(target, { offset: -70, duration: 1.1 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    if (!prefersReduced) {
      // 1. Scroll Cue Bounce Animation
      gsap.to('.scroll-cue span', {
        y: 10,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 2. Kinetic Editorial Split-Title Reveals (Jamie McKaye & Levo Studio style)
      document.querySelectorAll('.section .split-title, .cta .split-title').forEach((title) => {
        gsap.fromTo(
          title,
          { opacity: 0, y: 38 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // 3. Section Labels Stagger Animation
      document.querySelectorAll('.section-label, .eyebrow').forEach((label) => {
        const num = label.querySelector('.section-num');
        const name = label.querySelector('.label-name');
        const badge = label.querySelector('.active-badge, em');

        gsap
          .timeline({
            scrollTrigger: { trigger: label, start: 'top 90%' }
          })
          .fromTo(num, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' })
          .fromTo(name, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, '<0.08')
          .fromTo(badge, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<0.12');
      });

      // 4. Problem Cards Staggered Reveal
      document.querySelectorAll('.problem-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: (index % 3) * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%'
            }
          }
        );
      });

      // 5. Why Cyption Differentiators Stagger
      document.querySelectorAll('.diff-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (index % 3) * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%'
            }
          }
        );
      });

      // 6. Case Study Cards Reveal
      document.querySelectorAll('.case-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%'
            }
          }
        );
      });

      // 7. Service Columns Reveal (5 Pillars)
      document.querySelectorAll('.service-col').forEach((col, index) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (index % 5) * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: col,
              start: 'top 90%'
            }
          }
        );
      });

      // 8. Who We Work With Stages Stagger
      document.querySelectorAll('.stage-card').forEach((stage, index) => {
        gsap.fromTo(
          stage,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 88%'
            }
          }
        );
      });

      // 9. Growth System Cards Reveal
      document.querySelectorAll('.system-card').forEach((sysCard, index) => {
        gsap.fromTo(
          sysCard,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: (index % 3) * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sysCard,
              start: 'top 90%'
            }
          }
        );
      });

      // 10. Testimonial Cards Stagger
      document.querySelectorAll('.testi-card').forEach((testi, index) => {
        gsap.fromTo(
          testi,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (index % 2) * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: testi,
              start: 'top 90%'
            }
          }
        );
      });

      // 11. FAQ Items Stagger
      document.querySelectorAll('.faq-item').forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: (index % 4) * 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%'
            }
          }
        );
      });
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Preloader
        onExitStart={() => setHeroReady(true)}
        onComplete={() => setHeroReady(true)}
      />
      <CustomCursor />
      <Navbar />

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <Hero isReady={heroReady} />
          <TrustStrip />
          <Problem />
          <WhatWeDo />
          <WhyCyption />
          <CaseStudies />
          <Services />
          <WhoWeWorkWith />
          <GrowthSystem />
          {/* <Portfolio /> - Showcase section commented out */}
          <Testimonials />
          <GrowthAudit />
          <FAQ />
          <FinalCTA />
        </div>
      </main>

      <Footer />
    </>
  );
}
