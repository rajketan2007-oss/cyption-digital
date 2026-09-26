import React from 'react';
import { caseStudies } from '../../data';
import { AnimatedCounter } from '../common';

export default function CaseStudies() {
  return (
    <section className="case-studies section" id="case-studies">
      <div className="section-label">
        <span className="section-num">06</span>
        <span className="slash">/</span>
        <span className="label-name">Evidence</span>
        <span className="active-badge">[ Selected Growth Stories ]</span>
      </div>

      <div className="cases-header">
        <div>
          <h2 className="split-title">
            WORK THAT MOVED<br />
            <span>THE METRIC.</span>
          </h2>
          <span className="case-subheading">Selected Growth Stories</span>
        </div>
        <p className="case-disclaimer-note">
          <em>
            * Notice: All numeric results and booking metrics represent client-specific milestones and require formal verification for specific campaign scopes.
          </em>
        </p>
      </div>

      {caseStudies.map((study) => (
        <article className="case-card" key={study.id}>
          <div className="case-content">
            <div className="case-meta-row">
              <span className="case-client">{study.client}</span>
              <span className="case-industry">{study.industry}</span>
            </div>
            <h3 className="case-headline">{study.headline}</h3>
            <div className="case-details">
              <div className="case-detail-block">
                <strong>The Challenge:</strong>
                <p>{study.challenge}</p>
              </div>
              <div className="case-detail-block">
                <strong>What We Built:</strong>
                <div className="case-tags">
                  {study.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="case-metric-box">
              {study.metrics.map((m) => (
                <div className="metric-item" key={m.label}>
                  <span className="metric-number">
                    <AnimatedCounter value={m.number} />
                  </span>
                  <span className="metric-label">
                    {m.label} <em className="metric-flag">{m.flag}</em>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={`case-visual ${study.visualClass}`}>
            <div className="case-badge-pill">{study.badge}</div>
            <div className="visual-graphic">
              <div className="mockup-screen">
                <div className="mockup-header">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="mockup-body">
                  <div className="mock-stat">
                    {study.mockStat.label} <b><AnimatedCounter value={study.mockStat.val} /></b>
                  </div>
                  <div className="mock-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
