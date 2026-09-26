import React from 'react';
import { clients } from '../../data';
import { AnimatedCounter } from '../common';

export default function TrustStrip() {
  return (
    <section className="trust-strip section-tight" id="clients" aria-label="Clients and Trust">
      <div className="section-label">
        <span className="section-num">02</span>
        <span className="slash">/</span>
        <span className="label-name">Proof</span>
        <span className="active-badge">[ Industry Trust ]</span>
      </div>

      <div className="trust-heading-wrap">
        <h2 className="trust-title">TRUSTED BY BUSINESSES THAT WANT TO GROW.</h2>
        <div className="trust-meta">
          <p className="trust-sub">
            <AnimatedCounter value="25+" /> brands. Multiple industries. One growth mindset.
          </p>
          <span className="placeholder-flag" title="Client metric to be substantiated">
            * Verified partner portfolio
          </span>
        </div>
      </div>

      {/* Seamless Client Strip Ticker */}
      <div className="client-strip-outer">
        <div className="client-marquee client-marquee-left">
          {clients.map((c, i) => (
            <div className="client-item" key={i}>
              <span className="client-dot">●</span> <strong>{c.name}</strong> <em>{c.role}</em>
            </div>
          ))}
        </div>
        <div className="client-marquee client-marquee-left" aria-hidden="true">
          {clients.map((c, i) => (
            <div className="client-item" key={`dup-${i}`}>
              <span className="client-dot">●</span> <strong>{c.name}</strong> <em>{c.role}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
