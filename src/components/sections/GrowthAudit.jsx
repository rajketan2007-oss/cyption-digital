import React, { useState } from 'react';

const serviceOptions = [
  'Brand Strategy',
  'High-Converting Website',
  'Performance Ads',
  'SEO & Visibility',
  'Social Content',
  'Full Growth System'
];

export default function GrowthAudit() {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    website: '',
    services: ['Performance Ads']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceName) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceName);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== serviceName)
          : [...prev.services, serviceName]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.business ||
      !formData.phone ||
      !formData.email ||
      !formData.website
    ) {
      alert('Please fill in all required fields to request your growth audit.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      business: '',
      phone: '',
      email: '',
      website: '',
      services: ['Performance Ads']
    });
    setIsSubmitted(false);
  };

  return (
    <section className="growth-audit-section section" id="audit">
      <div className="section-label">
        <span className="section-num">12</span>
        <span className="slash">/</span>
        <span className="label-name">Audit</span>
        <span className="active-badge">[ Zero-Risk Diagnostic ]</span>
      </div>

      <div className="audit-wrapper">
        <div className="audit-intro">
          <h2 className="split-title">
            YOUR BRAND COULD BE<br />
            <span>LEAVING GROWTH</span><br />
            ON THE TABLE.
          </h2>
          <p className="audit-subhead">Get a Free Digital Growth Audit.</p>
          <p className="audit-explainer">
            Request an in-depth, human-reviewed diagnostic of your brand, channels, and conversion funnel. We examine your current digital footprint and deliver a clear, actionable roadmap to unlock untapped revenue.
          </p>

          {/* Diagnostic Scope Breakdown */}
          <div className="audit-breakdown-boxes">
            <div className="breakdown-card">
              <h4>We'll take a look at your:</h4>
              <ul>
                <li><span>●</span> Website &amp; UX Speed</li>
                <li><span>●</span> Instagram &amp; Social Channels</li>
                <li><span>●</span> Google Presence &amp; Maps</li>
                <li><span>●</span> Search Engine Optimization (SEO)</li>
                <li><span>●</span> Content &amp; Messaging Tone</li>
                <li><span>●</span> Paid Advertising (Meta &amp; Google)</li>
                <li><span>●</span> Conversion Journey &amp; Checkout</li>
              </ul>
            </div>

            <div className="breakdown-card highlight-card">
              <h4>And identify:</h4>
              <ul>
                <li><span>✓</span> <strong>What is working</strong> and driving actual returns</li>
                <li><span>✓</span> <strong>What's holding you back</strong> and leaking potential buyers</li>
                <li><span>✓</span> <strong>What you should improve next</strong> for maximum commercial leverage</li>
              </ul>
            </div>
          </div>

          <div className="audit-reassurance">
            <span className="reassurance-icon">🛡</span>
            <p><strong>No obligation. No sales pressure. Just actionable insights.</strong></p>
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="audit-form-container">
          <div className="form-header">
            <h3>Request Your Growth Audit</h3>
            <p>
              Fill out this form and our senior growth strategists will review your brand within 24 business hours.
            </p>
          </div>

          {!isSubmitted ? (
            <form id="growth-audit-form" className="audit-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="audit-name">Your Name *</label>
                <input
                  type="text"
                  id="audit-name"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="audit-business">Business / Brand Name *</label>
                <input
                  type="text"
                  id="audit-business"
                  name="business"
                  placeholder="e.g. Sharma Jewels / EcoTravel"
                  value={formData.business}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="audit-phone">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    id="audit-phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="audit-email">Work Email *</label>
                  <input
                    type="email"
                    id="audit-email"
                    name="email"
                    placeholder="rahul@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="audit-website">Website or Instagram Handle *</label>
                <input
                  type="text"
                  id="audit-website"
                  name="website"
                  placeholder="https://yourbrand.com or @yourbrand"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>What do you need help with? (Select all that apply)</label>
                <div className="service-pills-selector">
                  {serviceOptions.map((opt) => (
                    <label className="pill-checkbox" key={opt}>
                      <input
                        type="checkbox"
                        name="services"
                        value={opt}
                        checked={formData.services.includes(opt)}
                        onChange={() => handleCheckboxChange(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="submit-audit-btn magnetic"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.75 : 1,
                  pointerEvents: isSubmitting ? 'none' : 'auto'
                }}
              >
                <span>
                  {isSubmitting ? 'GENERATING AUDIT REQUEST...' : 'GET MY FREE GROWTH AUDIT'}
                </span>{' '}
                <span>↗</span>
              </button>

              <div className="form-privacy-note">
                Your information is protected. We will never share or spam your contact details.
              </div>
            </form>
          ) : (
            <div className="audit-success-box is-visible" id="audit-success" aria-hidden="false">
              <div className="success-icon">✓</div>
              <h3>Audit Request Received!</h3>
              <p>
                Thank you. Our growth strategy team is analyzing your brand's digital footprint. We will share your custom Growth Audit via WhatsApp / Email within 24 business hours.
              </p>
              <button type="button" className="reset-form-btn" onClick={handleReset}>
                Submit Another Request
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
