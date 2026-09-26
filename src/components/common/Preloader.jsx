import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete, onExitStart }) {
  const preloaderRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    });

    tl.fromTo(
      '.pre-logo i',
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.45, stagger: 0.15 }
    )
      .fromTo(
        '.pre-logo span',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.65, ease: 'power3.out' },
        '<.08'
      )
      .to('.preloader', {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
        delay: 0.25,
        onStart: () => {
          if (onExitStart) onExitStart();
        }
      });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete, onExitStart]);

  return (
    <div className="preloader" ref={preloaderRef} aria-hidden="true">
      <div className="pre-logo">
        <i></i>
        <span>CYPTION</span>
        <i></i>
      </div>
      <p>Building Digital Growth Systems</p>
    </div>
  );
}
