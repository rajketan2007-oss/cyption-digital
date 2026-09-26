import React from 'react';
import { problems } from '../../data';

export default function Problem() {
  return (
    <section className="problem section" id="problem">
      <div className="section-label">
        <span className="section-num">03</span>
        <span className="slash">/</span>
        <span className="label-name">Diagnosis</span>
        <span className="active-badge">[ The Growth Gap · 05 Critical Flaws ]</span>
      </div>

      <div className="section-header-block">
        <h2 className="split-title">
          YOUR BUSINESS DOESN'T<br />
          NEED MORE MARKETING.<br />
          <span>IT NEEDS MARKETING THAT</span><br />
          WORKS TOGETHER.
        </h2>
        <div className="intro-copy">
          <p>
            Most businesses don't suffer from a lack of effort. They suffer from disconnected tactics: an agency running ads, a freelancer posting graphics, an old website nobody updates, and zero clear attribution.
          </p>
          <p>
            When your digital channels don't talk to each other, you waste budget, confuse potential buyers, and generate clicks instead of profitable customers.
          </p>
        </div>
      </div>

      {/* 5 Problem Cards Grid */}
      <div className="problem-grid">
        {problems.map((prob) => (
          <article className="problem-card" key={prob.num}>
            <div className="problem-header">
              <span className="problem-num">{prob.num}</span>
              <span className="problem-icon">{prob.icon}</span>
            </div>
            <h3>{prob.title}</h3>
            <p>{prob.desc}</p>
            <div className="problem-impact">{prob.impact}</div>
          </article>
        ))}
      </div>

      {/* Transition Line & Flow */}
      <div className="problem-transition-box">
        <div className="transition-lead">
          <span className="trans-signal">SYSTEM INTEGRATION</span>
          <h3>CYPTION CONNECTS THE DOTS.</h3>
          <p>
            We eliminate channel friction by aligning every customer touchpoint into one continuous conversion flywheel.
          </p>
        </div>

        <div className="connected-flow-bar" aria-label="Cyption integrated flow">
          <span className="flow-pill">Brand</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill">Content</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill">Website</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill">Traffic</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill">Leads</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill">Conversion</span>
          <span className="flow-sep">→</span>
          <span className="flow-pill flow-win">Growth</span>
        </div>

        <a href="#audit" className="cta-button magnetic trans-cta">
          Find Your Growth Gap <span>↗</span>
        </a>
      </div>
    </section>
  );
}
