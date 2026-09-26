import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useKolkataTime } from '../../hooks';
import { navLinks, mobileNavLinks, agencyContactInfo } from '../../data';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const time = useKolkataTime();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mobileMenuRef = useRef(null);

  // Sticky header and scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (window.innerWidth >= 1024 ? 20 : 15));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setScrollProgress(self.progress)
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      st.kill();
    };
  }, []);

  // Safe logo transparency processor
  const handleLogoLoad = (e) => {
    const image = e.target;
    if (!image || image.dataset.processed) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = pixels.data;
      for (let i = 0; i < data.length; i += 4) {
        const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (luminance < 32) data[i + 3] = 0;
      }
      ctx.putImageData(pixels, 0, 0);
      image.dataset.processed = 'true';
      image.src = canvas.toDataURL('image/png');
    } catch {
      image.dataset.processed = 'true';
    }
  };

  // Mobile menu toggle animation
  useEffect(() => {
    const mobileMenu = mobileMenuRef.current;
    if (!mobileMenu) return;

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    if (isMenuOpen) {
      mobileMenu.style.visibility = 'visible';
      gsap.to(mobileMenu, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.45,
        ease: 'power3.inOut'
      });
      gsap.fromTo(
        '.mobile-menu a',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, delay: 0.15, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.mobile-footer',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, delay: 0.35, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileMenu, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => {
          mobileMenu.style.visibility = 'hidden';
        }
      });
    }
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`site-header ${isScrolled ? 'scrolled' : ''}`}
        id="site-header"
      >
        <a href="#home" className="brand-logo magnetic" aria-label="Cyption Digital Home">
          <img
            data-logo-tone="light"
            src="/assets/cyption-logo.png"
            alt="Cyption Digital"
            onLoad={handleLogoLoad}
          />
        </a>

        <nav className="desktop-nav" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="clock" title="Agency Local Time (Kolkata, India)">
            <span className="clock-dot"></span>
            <span id="local-time">{time}</span>
            <em>KOL / IST</em>
          </div>
          <a className="audit-nav-btn magnetic" href="#audit">
            Get a Free Growth Audit
          </a>
          <a className="talk-button magnetic" href="#contact">
            Let's Talk <span>↗</span>
          </a>
          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i></i>
            <i></i>
          </button>
        </div>

        {/* Scroll Progress Line Indicator */}
        <div
          className="scroll-progress-line"
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className="mobile-menu"
        id="mobile-menu"
        ref={mobileMenuRef}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-inner">
          <p>Menu / Growth Navigation</p>
          {mobileNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={link.isHighlight ? 'mobile-highlight' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <div className="mobile-footer">
            <span>© 2026 Cyption Digital · {agencyContactInfo.address}</span>
            <a href={`tel:${agencyContactInfo.phoneRaw}`}>{agencyContactInfo.phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
