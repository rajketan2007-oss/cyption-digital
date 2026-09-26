import React, { useState } from 'react';
import { portfolioProjects, portfolioFilters } from '../../data';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = portfolioProjects.filter(
    (p) => activeFilter === 'all' || p.categories.includes(activeFilter)
  );

  return (
    <section className="portfolio section" id="portfolio">
      <div className="section-label">
        <span className="section-num">10</span>
        <span className="slash">/</span>
        <span className="label-name">Showcase</span>
        <span className="active-badge">[ Creative &amp; Technical Execution ]</span>
      </div>

      <div className="portfolio-header">
        <h2 className="split-title">
          SOME THINGS<br />
          <span>WE'VE BUILT.</span>
        </h2>
        <p className="intro-copy">
          A curated look across our design, code, and campaign work. From brand identity systems to high-performing performance campaigns.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="portfolio-filter-bar" role="tablist" aria-label="Portfolio Category Filters">
        {portfolioFilters.map((f) => (
          <button
            key={f.id}
            className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
            data-filter={f.id}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="portfolio-grid" id="portfolio-grid">
        {filteredProjects.map((p) => (
          <div className="portfolio-item" key={p.title}>
            <div className="port-card">
              <div className={`port-media ${p.gradientClass}`}>
                <div className="port-media-content">
                  <span className="port-mock-tag">{p.tag}</span>
                  <h4>{p.client}</h4>
                  <p>{p.subtitle}</p>
                </div>
              </div>
              <div className="port-info">
                <span className="port-cat">{p.catLabel}</span>
                <h3>{p.title}</h3>
                <a href="#audit" className="port-link">
                  View Project ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
