import React from 'react';
import { capabilities } from '../../data';
import { useSmoothCardsSlider } from '../../hooks';

export default function WhatWeDo() {
  const {
    railRef,
    activeIndex,
    scrollToCard,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  } = useSmoothCardsSlider({
    cardSelector: '.feature-card',
    totalItems: capabilities.length,
    enableMouseDrag: true,
  });

  return (
    <section className="capabilities section" id="capabilities">
      <div className="section-label">
        <span className="section-num">04</span>
        <span className="slash">/</span>
        <span className="label-name">Capabilities</span>
        <span className="active-badge">[ Connected Stack · 06 Growth Layers ]</span>
      </div>

      <div className="section-grid">
        <h2 className="split-title">
          ONE PARTNER.<br />
          <span>EVERY DIGITAL</span><br />
          GROWTH LAYER.
        </h2>
        <div className="intro-copy">
          <p>
            Your customers don't experience your business in separate departments. They experience one brand. That's why Cyption brings strategy, creative, technology and performance together to build a connected digital presence.
          </p>
          <p>
            From day one, every design choice, campaign experiment, and code deployment is architected to compound customer lifetime value and drive verifiable pipeline.
          </p>
        </div>
      </div>

      {/* 6 Interactive Hover Cards Rail */}
      <div className="rail-wrap">
        <div className="rail-top-bar">
          <div className="drag-hint">
            <span>⟷</span> Swipe or drag to explore capabilities
          </div>
          <div className="rail-counter-nav">
            <span className="rail-count-badge">
              0{activeIndex + 1} <span className="slash">/</span> 0{capabilities.length}
            </span>
            <div className="rail-nav-arrows">
              <button
                type="button"
                className={`rail-arrow-btn prev ${!canScrollPrev ? 'disabled' : ''}`}
                onClick={scrollPrev}
                aria-label="Previous capability card"
                disabled={!canScrollPrev}
              >
                ←
              </button>
              <button
                type="button"
                className={`rail-arrow-btn next ${!canScrollNext ? 'disabled' : ''}`}
                onClick={scrollNext}
                aria-label="Next capability card"
                disabled={!canScrollNext}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="feature-rail" id="capabilities-rail" ref={railRef}>
          {capabilities.map((c, i) => (
            <article
              className={`feature-card ${c.theme} ${activeIndex === i ? 'in-view' : ''}`}
              key={c.title}
              onClick={() => scrollToCard(i)}
            >
              <div className="card-top">
                <span>{c.num}</span>
                <span className="card-tag">{c.tag}</span>
              </div>
              <div className="card-mark">{c.mark}</div>
              <h3>{c.title}</h3>
              <p>
                <strong>{c.highlight}</strong> {c.desc}
              </p>
              <div className="card-deliverables">{c.deliverables}</div>
              <a href="#audit">
                Explore Layer <b>↗</b>
              </a>
            </article>
          ))}
        </div>

        <div className="rail-pagination" aria-label="Capabilities card pagination">
          {capabilities.map((_, i) => (
            <button
              type="button"
              className={`dot ${activeIndex === i ? 'active' : ''}`}
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Jump to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="rail-action-row">
          <a href="#services" className="talk-button magnetic">
            Explore All Capabilities <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
