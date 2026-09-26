import React from 'react';
import { servicePillars } from '../../data';

export default function Services() {
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

      {/* 5 Columns Grid */}
      <div className="services-columns-grid">
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
    </section>
  );
}
