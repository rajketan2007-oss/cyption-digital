import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReduced || !hasFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const cursorText = textRef.current;

    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3' });

    const handlePointerMove = (e) => {
      dotX(e.clientX - 3.5);
      dotY(e.clientY - 3.5);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove);

    const setCursorBadge = (label) => {
      if (cursorText && label) {
        cursorText.textContent = label;
        ring.classList.add('has-badge');
        document.body.classList.add('cursor-badge-active');
      } else {
        ring.classList.remove('has-badge');
        document.body.classList.remove('cursor-badge-active');
      }
    };

    // Attach delegated hover events
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      // Badge triggers
      if (target.closest('.feature-card')) {
        setCursorBadge('Explore ↗');
      } else if (target.closest('.problem-card')) {
        setCursorBadge('Problem ⦻');
      } else if (target.closest('.case-card')) {
        setCursorBadge('Results ↗');
      } else if (target.closest('.port-card')) {
        setCursorBadge('View ↗');
      } else if (target.closest('.faq-item button')) {
        setCursorBadge('Read +');
      }

      // Magnetic hover scaling
      if (
        target.closest(
          '.magnetic, .talk-button, .back-top, .desktop-nav a, .audit-nav-btn, .primary-hero-btn, .secondary-hero-btn, .filter-btn, .step-btn'
        )
      ) {
        gsap.to(ring, { scale: 1.4, borderColor: 'var(--lime)', duration: 0.25 });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      if (
        target.closest('.feature-card') ||
        target.closest('.problem-card') ||
        target.closest('.case-card') ||
        target.closest('.port-card') ||
        target.closest('.faq-item button')
      ) {
        setCursorBadge(null);
      }

      if (
        target.closest(
          '.magnetic, .talk-button, .back-top, .desktop-nav a, .audit-nav-btn, .primary-hero-btn, .secondary-hero-btn, .filter-btn, .step-btn'
        )
      ) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.9)', duration: 0.25 });
      }
    };

    // Magnetic button movement
    const handleMagneticMove = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const button = target.closest('.magnetic');
      if (button) {
        const r = button.getBoundingClientRect();
        gsap.to(button, {
          x: (e.clientX - r.left - r.width / 2) * 0.16,
          y: (e.clientY - r.top - r.height / 2) * 0.16,
          duration: 0.35,
          ease: 'power2.out'
        });
      }
    };

    const handleMagneticLeave = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      const button = target.closest('.magnetic');
      if (button) {
        gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'power2.out' });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMagneticMove);
    document.addEventListener('mouseleave', handleMagneticLeave, true);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousemove', handleMagneticMove);
      document.removeEventListener('mouseleave', handleMagneticLeave, true);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true"></div>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cursor-text" ref={textRef}></span>
      </div>
    </>
  );
}
