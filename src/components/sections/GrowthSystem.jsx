import React, { useState } from 'react';
import { growthSteps } from '../../data';
import { useSmoothCardsSlider } from '../../hooks';

export default function GrowthSystem() {
  const [activeStep, setActiveStep] = useState(0);

  const {
    railRef,
    scrollToCard,
  } = useSmoothCardsSlider({
    cardSelector: '.system-card',
    totalItems: growthSteps.length,
    initialIndex: 0,
    enableMouseDrag: true,
    onIndexChange: (idx) => setActiveStep(idx),
  });

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    scrollToCard(idx);
  };

  return (
    <section className="growth-system section" id="growth-system">
      <div className="section-label">
        <span className="section-num">09</span>
        <span className="slash">/</span>
        <span className="label-name">Methodology</span>
        <span className="active-badge">[ Proprietary 6-Step Engine ]</span>
      </div>

      <div className="system-intro-wrap">
        <h2 className="split-title">
          THE CYPTION<br />
          <span>GROWTH SYSTEM™</span>
        </h2>
        <p className="intro-copy">
          Our 6-step branded methodology eliminates guesswork. From initial diagnosis to compounded scale, we build an interconnected growth machine that works as a unified ecosystem.
        </p>
      </div>

      {/* Horizontal Methodology Flow Bar */}
      <div className="system-flow-wrapper">
        <div className="system-step-tracker" role="tablist" aria-label="Cyption Growth System Steps">
          {growthSteps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                className={`step-btn ${activeStep === idx ? 'active' : ''}`}
                data-step-target={idx}
                role="tab"
                aria-selected={activeStep === idx}
                onClick={() => handleStepClick(idx)}
              >
                <span className="step-num-pill">{s.num}</span>
                <strong>{s.shortName}</strong>
              </button>
              {idx < growthSteps.length - 1 && (
                <span className="system-step-arrow" aria-hidden="true">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mobile-swipe-hint">
        <span>⟷</span> Swipe steps horizontally
      </div>

      {/* 6 Steps Interactive Cards Grid / Track */}
      <div className="system-cards-grid" ref={railRef}>
        {growthSteps.map((s, idx) => (
          <article
            className={`system-card ${activeStep === idx ? 'active' : ''}`}
            data-step-index={idx}
            key={s.num}
            onClick={() => handleStepClick(idx)}
          >
            <div className="sys-top">
              <span className="sys-badge">{s.phase}</span>
              <span className="sys-icon">{s.icon}</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="sys-output">
              <strong>Output:</strong> {s.output}
            </div>
          </article>
        ))}
      </div>

      {/* Mobile Dots Indicator */}
      <div className="mobile-dots-indicator" aria-label="Methodology step pagination">
        {growthSteps.map((_, i) => (
          <button
            type="button"
            className={`dot ${activeStep === i ? 'active' : ''}`}
            key={i}
            onClick={() => handleStepClick(i)}
            aria-label={`Jump to step ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
