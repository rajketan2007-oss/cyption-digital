import React from 'react';
import { agencyContactInfo } from '../../data';

export default function FinalCTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta-spark" aria-hidden="true"></div>
      <p className="section-label">
        <span className="section-num">14</span>
        <span className="slash">/</span>
        <span className="label-name">Action</span>
        <span className="active-badge">[ Let's Build What's Next ]</span>
      </p>

      <h2 className="split-title cta-title">
        <span className="bracket">[</span> READY TO MOVE<br />
        <span>YOUR BRAND</span> FORWARD? <span className="bracket">]</span>
      </h2>

      <p className="final-cta-copy">
        You bring the ambition. We'll build the system behind it. Whether you need a stronger brand, better digital presence, more qualified leads or a complete growth strategy — <strong>LET'S BUILD WHAT'S NEXT.</strong>
      </p>

      <div className="final-cta-actions">
        <a href={`mailto:${agencyContactInfo.email}`} className="cta-button primary-cta-btn magnetic">
          <span className="btn-bracket">[</span> Start a Conversation <span className="btn-bracket">]</span> <span>↗</span>
        </a>
        <a href="#audit" className="secondary-cta-btn magnetic">
          Get a Free Growth Audit <span>↗</span>
        </a>
      </div>

      <div className="contact-line">
        <div>
          <span>DIRECT LINE // </span>
          <a href={`tel:${agencyContactInfo.phoneRaw}`}>{agencyContactInfo.phone}</a>
        </div>
        <div>
          <span>OFFICIAL EMAIL // </span>
          <a href={`mailto:${agencyContactInfo.email}`}>{agencyContactInfo.email}</a>
        </div>
        <div>
          <span>HEADQUARTERS // </span>
          <em>{agencyContactInfo.address}</em>
        </div>
      </div>
    </section>
  );
}
