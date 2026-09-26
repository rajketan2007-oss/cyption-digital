import React, { useState } from 'react';
import {
  footerExploreLinks,
  footerServiceLinks,
  socialLinks,
  agencyContactInfo
} from '../../data';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="footer-head">
        <div className="footer-brand-box">
          <a className="brand-logo footer-logo" href="#home" aria-label="Cyption Digital Home">
            <img data-logo-tone="light" src="/assets/cyption-logo.png" alt="Cyption Digital" />
          </a>
          <p className="footer-tagline">
            <strong>CYPTION</strong> — Digital Growth Agency<br />
            <span>Brand · Creative · Technology · Performance</span>
          </p>
          <p className="footer-mission">
            "We don't just market your business. We build the system that helps it grow."
          </p>
        </div>
        <button
          className="back-top magnetic"
          aria-label="Scroll back to top of page"
          onClick={scrollToTop}
        >
          Back to top ↑
        </button>
      </div>

      <div className="footer-grid">
        {/* Explore */}
        <div>
          <h4>Explore</h4>
          {footerExploreLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Services */}
        <div>
          <h4>Services</h4>
          {footerServiceLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Connect & Contact */}
        <div className="subscribe">
          <h4>Stay Connected</h4>
          <p>
            Sign up for our monthly growth dispatch. Curated insights on brand positioning, conversion architecture, and paid performance strategy.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              aria-label="Email address"
              type="email"
              placeholder="Your work email address"
              required
            />
            <button type="submit">
              {subscribed ? 'Subscribed ✓' : 'Subscribe'} <span>↗</span>
            </button>
          </form>

          <div className="footer-direct-contact">
            <div>
              <strong>Call / WhatsApp:</strong>{' '}
              <a href={`tel:${agencyContactInfo.phoneRaw}`}>{agencyContactInfo.phone}</a>
            </div>
            <div>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${agencyContactInfo.email}`}>{agencyContactInfo.email}</a>
            </div>
            <div>
              <strong>Address:</strong> {agencyContactInfo.address}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 Cyption Digital. All Rights Reserved. Digital Growth Agency — Brand. Creative. Technology. Performance.
        </span>
        <div className="socials">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
