import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { capabilities } from '../../data';

gsap.registerPlugin(Draggable);

export default function WhatWeDo() {
  const railRef = useRef(null);
  const wrapRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    if (!rail || !wrap) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const cards = rail.querySelectorAll('.feature-card');
    const cardGap = isMobile ? 14 : 18;
    const cardStep = () => (cards[0] ? cards[0].offsetWidth + cardGap : 340);
    const maxX = () =>
      Math.min(0, wrap.clientWidth - rail.scrollWidth - (isMobile ? 24 : window.innerWidth * 0.04));

    const snapPoints = (endValue) => {
      const step = cardStep();
      const snapped = Math.round(endValue / step) * step;
      return Math.max(maxX(), Math.min(0, snapped));
    };

    function updateCards() {
      const wrapRect = wrap.getBoundingClientRect();
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      let closest = 0;
      let best = Infinity;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - wrapCenter);
        if (distance < best) {
          best = distance;
          closest = i;
        }

        const distRatio = distance / (wrapRect.width / 2);
        const cardScale = isMobile
          ? Math.max(0.94, 1 - distRatio * 0.06)
          : Math.max(0.9, 1 - distRatio * 0.12);
        const cardOpacity = isMobile
          ? Math.max(0.75, 1 - distRatio * 0.3)
          : Math.max(0.55, 1 - distRatio * 0.5);
        gsap.to(card, { scale: cardScale, opacity: cardOpacity, duration: 0.15, overwrite: 'auto' });
      });

      cards.forEach((card, i) => {
        card.classList.toggle('in-view', i === closest);
      });
      setActiveIndex(closest);
    }

    const [draggable] = Draggable.create(rail, {
      type: 'x',
      bounds: () => ({ minX: maxX(), maxX: 0 }),
      edgeResistance: 0.75,
      allowNativeVerticalScrolling: true,
      dragClickables: false,
      snap: isMobile || isTablet ? { x: snapPoints } : false,
      onDrag: updateCards,
      onThrowUpdate: updateCards
    });

    updateCards();

    return () => {
      if (draggable) draggable.kill();
    };
  }, []);

  const scrollToCard = (index) => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    if (!rail || !wrap) return;

    const cards = rail.querySelectorAll('.feature-card');
    const cardGap = window.innerWidth < 768 ? 14 : 18;
    const cardStep = cards[0] ? cards[0].offsetWidth + cardGap : 340;
    const maxX = Math.min(
      0,
      wrap.clientWidth - rail.scrollWidth - (window.innerWidth < 768 ? 24 : window.innerWidth * 0.04)
    );
    const targetX = Math.max(maxX, Math.min(0, -index * cardStep));

    gsap.to(rail, { x: targetX, duration: 0.65, ease: 'power3.out' });
    setActiveIndex(index);
  };

  return (
    <section className="capabilities section" id="capabilities">
      <div className="section-label">
        <span className="section-num">04</span>
        <span className="slash">/</span>
        <span className="label-name">Capabilities</span>
        <span className="active-badge">[ Connected Stack · 06 Growth Layers ]</span>
      </div>

      <div className="section-grid">
        <h2 className="split-title">
          ONE PARTNER.<br />
          <span>EVERY DIGITAL</span><br />
          GROWTH LAYER.
        </h2>
        <div className="intro-copy">
          <p>
            Your customers don't experience your business in separate departments. They experience one brand. That's why Cyption brings strategy, creative, technology and performance together to build a connected digital presence.
          </p>
          <p>
            From day one, every design choice, campaign experiment, and code deployment is architected to compound customer lifetime value and drive verifiable pipeline.
          </p>
        </div>
      </div>

      {/* 6 Interactive Hover Cards Rail */}
      <div className="rail-wrap" ref={wrapRef}>
        <div className="drag-hint">
          Drag or swipe to explore capabilities <span>⟷</span>
        </div>
        <div className="feature-rail" id="capabilities-rail" ref={railRef}>
          {capabilities.map((c) => (
            <article className={`feature-card ${c.theme}`} key={c.title}>
              <div className="card-top">
                <span>{c.num}</span>
                <span className="card-tag">{c.tag}</span>
              </div>
              <div className="card-mark">{c.mark}</div>
              <h3>{c.title}</h3>
              <p>
                <strong>{c.highlight}</strong> {c.desc}
              </p>
              <div className="card-deliverables">{c.deliverables}</div>
              <a href="#audit">
                Explore Layer <b>↗</b>
              </a>
            </article>
          ))}
        </div>

        <div className="rail-pagination" aria-hidden="true">
          {capabilities.map((_, i) => (
            <span
              className={`dot ${activeIndex === i ? 'active' : ''}`}
              key={i}
              onClick={() => scrollToCard(i)}
            ></span>
          ))}
        </div>

        <div className="rail-action-row">
          <a href="#services" className="talk-button magnetic">
            Explore All Capabilities <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
