import React from 'react';
import { testimonials } from '../../data';
import { AnimatedCounter } from '../common';

export default function Testimonials() {
  return (
    <section className="testimonials section" id="testimonials">
      <div className="section-label">
        <span className="section-num">11</span>
        <span className="slash">/</span>
        <span className="label-name">Validation</span>
        <span className="active-badge">[ Real Client Voices ]</span>
      </div>

      <div className="testi-header">
        <div>
          <h2 className="split-title">
            DON'T TAKE OUR<br />
            <span>WORD FOR IT.</span>
          </h2>
          <span className="testi-subheading">What Our Clients Say</span>
        </div>

        {/* Google Review Rating Badge */}
        <div className="google-review-badge">
          <div className="stars-row">★★★★★</div>
          <div className="badge-text">
            <strong>
              <AnimatedCounter value="4.9" /> / 5.0 RATING
            </strong>
            <span>Verified Google Reviews</span>
          </div>
          <a href="#contact" className="read-reviews-link">
            Read More Reviews ↗
          </a>
        </div>
      </div>

      {/* Testimonial Cards Grid */}
      <div className="testi-grid">
        {testimonials.map((t) => (
          <article className="testi-card" key={t.author}>
            <div className="testi-stars">★★★★★</div>
            <blockquote className="testi-quote">{t.quote}</blockquote>
            <div className="testi-author">
              <div className="author-avatar">{t.avatar}</div>
              <div className="author-details">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
