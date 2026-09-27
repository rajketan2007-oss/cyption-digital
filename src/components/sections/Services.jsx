import React from 'react';
import { servicePillars } from '../../data';
import { useSmoothCardsSlider } from '../../hooks';

export default function Services() {
  const {
    railRef,
    activeIndex,
    scrollToCard,
  } = useSmoothCardsSlider({
    cardSelector: '.service-col',
    totalItems: servicePillars.length,
    enableMouseDrag: true,
  });

  return (
    <section className="services-matrix section" id="services">
      <div className="section-label">
        <span className="section-num">07</span>
        <span className="slash">/</span>
        <span className="label-name">Scope</span>
        <span className="active-badge">[ 05 Specialized Columns ]</span>
      </div>

      <div className="section-header-block">
        <h2 className="split-title">
          WHAT CAN WE<br />
          <span>BUILD FOR YOU?</span>
        </h2>
        <p className="intro-copy">
          A comprehensive modular matrix of growth capabilities. Engage us for a single high-priority pillar or deploy Cyption as your full-spectrum growth department.
        </p>
      </div>

      <div className="mobile-swipe-hint">
        <span>⟷</span> Swipe pillars horizontally
      </div>

      {/* 5 Columns Grid / Track */}
      <div className="services-columns-grid" ref={railRef}>
        {servicePillars.map((pillar) => (
          <div className="service-col" key={pillar.tag}>
            <div className="col-head">
              <span className="col-tag">{pillar.tag}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </div>
            <ul className="service-items-list">
              {pillar.items.map((item) => (
                <li key={item}>
                  <span>✦</span> {item}
                </li>
              ))}
            </ul>
            <a href="#audit" className="col-link">
              {pillar.linkText}
            </a>
          </div>
        ))}
      </div>

      {/* Mobile Dots Indicator */}
      <div className="mobile-dots-indicator" aria-label="Services pagination">
        {servicePillars.map((_, i) => (
          <button
            type="button"
            className={`dot ${activeIndex === i ? 'active' : ''}`}
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Jump to service pillar ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
