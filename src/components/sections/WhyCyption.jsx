import React from 'react';
import { differentiators, comparisonPoints } from '../../data';

export default function WhyCyption() {
  return (
    <section className="why-cyption section" id="why-cyption">
      <div className="section-label">
        <span className="section-num">05</span>
        <span className="slash">/</span>
        <span className="label-name">Advantage</span>
        <span className="active-badge">[ The Growth Partner Difference ]</span>
      </div>

      <div className="why-header">
        <h2 className="split-title">
          NOT ANOTHER AGENCY.<br />
          <span>A GROWTH PARTNER.</span>
        </h2>
        <p className="section-sub-copy">
          We reject generic marketing retainers. We operate as an embedded extension of your executive leadership team, linking every creative asset directly to top-line business expansion.
        </p>
      </div>

      {/* 5 Differentiators Cards */}
      <div className="differentiators-grid">
        {differentiators.map((diff) => (
          <div className="diff-card" key={diff.num}>
            <span className="diff-num">{diff.num}</span>
            <h3>{diff.title}</h3>
            <p>{diff.desc}</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="comparison-container">
        <div className="comp-intro">
          <span className="comp-badge">THE ARCHITECTURE CONTRAST</span>
          <h3>Traditional Agency vs. Cyption Growth Partner</h3>
        </div>
        <div className="comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Traditional Agency</th>
                <th className="th-cyption">Cyption Growth Partner</th>
              </tr>
            </thead>
            <tbody>
              {comparisonPoints.map((pt) => (
                <tr key={pt.dimension}>
                  <td>
                    <strong>{pt.dimension}</strong>
                  </td>
                  <td>{pt.traditional}</td>
                  <td className="td-cyption">{pt.cyption}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="why-closing-callout">
        <p>"You don't need more marketing activity. You need a better growth system."</p>
      </div>
    </section>
  );
}
