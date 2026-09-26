import React, { useState } from 'react';
import { faqs } from '../../data';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq section" id="faq">
      <div className="faq-top">
        <div>
          <div className="section-label">
            <span className="section-num">13</span>
            <span className="slash">/</span>
            <span className="label-name">Questions</span>
            <span className="active-badge">[ Clear Answers · 07 Queries ]</span>
          </div>
          <h2 className="split-title">
            QUESTIONS BEFORE<br />
            <span>WE START?</span>
          </h2>
        </div>
        <p>
          Clear strategy starts with an open, honest conversation. Here are the questions ambitious business owners ask us before partnering with Cyption.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <article className={`faq-item ${isOpen ? 'open' : ''}`} key={faq.num}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.num}</span>
                {faq.q}
                <i>{isOpen ? '×' : '+'}</i>
              </button>
              <div
                className="faq-answer"
                style={{
                  height: isOpen ? 'auto' : 0,
                  transition: 'height 0.35s ease'
                }}
              >
                <p>{faq.a}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
