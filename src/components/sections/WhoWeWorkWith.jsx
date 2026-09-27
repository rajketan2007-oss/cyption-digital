import React from 'react';
import { stages } from '../../data';
import { useSmoothCardsSlider } from '../../hooks';

export default function WhoWeWorkWith() {
  const {
    railRef,
    activeIndex,
    scrollToCard,
  } = useSmoothCardsSlider({
    cardSelector: '.stage-card',
    totalItems: stages.length,
    enableMouseDrag: true,
  });

  return (
    <section className="who-we-work-with section" id="who-we-work-with">
      <div className="section-label">
        <span className="section-num">08</span>
        <span className="slash">/</span>
        <span className="label-name">Alignment</span>
        <span className="active-badge">[ Stage-Specific Architectures ]</span>
      </div>

      <div className="stages-header">
        <h2 className="split-title">
          BUILT FOR BUSINESSES AT<br />
          <span>DIFFERENT STAGES.</span>
        </h2>
        <p className="intro-copy">
          A seed-stage startup needs different velocity than an established heritage company. We tailor the growth system directly to where your commercial leverage is highest.
        </p>
      </div>

      <div className="mobile-swipe-hint">
        <span>⟷</span> Swipe stages horizontally
      </div>

      {/* 3 Stage Cards Grid / Track */}
      <div className="stages-grid" ref={railRef} data-lenis-prevent="true">
        {stages.map((stage, idx) => (
          <article
            className={`stage-card ${stage.isFeatured ? 'featured-stage' : ''} ${activeIndex === idx ? 'in-view' : ''}`}
            key={stage.num}
          >
            <div className="stage-top">
              <span className={`stage-badge ${stage.isFeatured ? 'highlight' : ''}`}>
                {stage.badge}
              </span>
              <h3>{stage.title}</h3>
              <p className="stage-sub">{stage.subtitle}</p>
            </div>
            <div className="stage-flow-box">
              {stage.flowPills.map((pill, pIdx) => (
                <React.Fragment key={pill}>
                  <span
                    className={`flow-pill ${pIdx === stage.flowPills.length - 1 ? 'flow-win' : ''}`}
                  >
                    {pill}
                  </span>
                  {pIdx < stage.flowPills.length - 1 && (
                    <span className="flow-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="stage-desc">{stage.desc}</p>
            <ul className="stage-checklist">
              {stage.checklist.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
            <a
              href="#audit"
              className={`stage-action ${stage.isFeatured ? 'highlight' : ''}`}
            >
              {stage.ctaText}
            </a>
          </article>
        ))}
      </div>

      {/* Mobile Dots Indicator */}
      <div className="mobile-dots-indicator" aria-label="Stages pagination">
        {stages.map((_, i) => (
          <button
            type="button"
            className={`dot ${activeIndex === i ? 'active' : ''}`}
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Jump to stage ${i + 1}`}
          />
        ))}
      </div>

      <div className="stages-footer-banner">
        <p>"Wherever you are today, we'll help you identify what needs to happen next."</p>
        <a href="#audit" className="talk-button magnetic">
          Tell Us Where You Are →
        </a>
      </div>
    </section>
  );
}
