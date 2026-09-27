import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useSmoothCardsSlider
 * Ultra-smooth, zero-lag card sliding for mobile touch (100% native compositor momentum)
 * and desktop mouse dragging with kinetic momentum, snap alignment, and dot pagination.
 */
export function useSmoothCardsSlider({
  cardSelector = '.feature-card',
  totalItems = 0,
  initialIndex = 0,
  enableMouseDrag = true,
  onIndexChange = null,
} = {}) {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(initialIndex);
  activeIndexRef.current = activeIndex;

  const isMouseDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef(null);

  // Smoothly scroll to a specific card index (used by arrow buttons & dots)
  const scrollToCard = useCallback((index) => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = rail.querySelectorAll(cardSelector);
    if (!cards.length) return;

    const safeIndex = Math.max(0, Math.min(cards.length - 1, index));
    const targetCard = cards[safeIndex];
    if (!targetCard) return;

    const isMobile = window.innerWidth <= 768;
    const railWidth = rail.clientWidth;
    const cardWidth = targetCard.offsetWidth;
    const cardOffset = targetCard.offsetLeft;

    const targetScrollLeft = isMobile
      ? cardOffset - (railWidth - cardWidth) / 2
      : cardOffset - 32;

    rail.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });

    setActiveIndex(safeIndex);
    if (onIndexChange) onIndexChange(safeIndex);
  }, [cardSelector, onIndexChange]);

  const scrollPrev = useCallback(() => {
    scrollToCard(activeIndexRef.current - 1);
  }, [scrollToCard]);

  const scrollNext = useCallback(() => {
    scrollToCard(activeIndexRef.current + 1);
  }, [scrollToCard]);

  // Ultra-lightweight scroll tracker: only updates state when active card actually changes
  const handleScroll = useCallback(() => {
    if (animFrameRef.current) return;

    animFrameRef.current = requestAnimationFrame(() => {
      animFrameRef.current = null;
      const rail = railRef.current;
      if (!rail) return;

      const cards = rail.querySelectorAll(cardSelector);
      if (!cards.length) return;

      const center = rail.scrollLeft + rail.clientWidth / 2;
      let closest = 0;
      let minDiff = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const diff = Math.abs(cardCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }

      if (closest !== activeIndexRef.current) {
        activeIndexRef.current = closest;
        setActiveIndex(closest);
        if (onIndexChange) onIndexChange(closest);
      }
    });
  }, [cardSelector, onIndexChange]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Passive scroll listener for zero-latency tracking
    rail.addEventListener('scroll', handleScroll, { passive: true });

    if (!enableMouseDrag) {
      return () => {
        rail.removeEventListener('scroll', handleScroll);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    // --- Desktop Mouse Drag Handling Only (Leaves touch 100% native & lag-free) ---
    const onMouseDown = (e) => {
      // Don't drag if clicking buttons, links, or form controls
      if (e.target.closest('button, a, input, textarea, select')) return;
      isMouseDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.pageX;
      scrollLeftRef.current = rail.scrollLeft;
      lastXRef.current = e.pageX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
      rail.style.cursor = 'grabbing';
      rail.style.userSelect = 'none';
    };

    const onMouseMove = (e) => {
      if (!isMouseDraggingRef.current) return;
      const x = e.pageX;
      const diff = x - startXRef.current;

      if (Math.abs(diff) > 4) {
        hasMovedRef.current = true;
      }

      const now = Date.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (x - lastXRef.current) / dt;
      }
      lastXRef.current = x;
      lastTimeRef.current = now;

      rail.scrollLeft = scrollLeftRef.current - diff;
    };

    const onMouseUp = () => {
      if (!isMouseDraggingRef.current) return;
      isMouseDraggingRef.current = false;
      rail.style.cursor = 'grab';
      rail.style.removeProperty('user-select');

      const vel = velocityRef.current;
      const currentIdx = activeIndexRef.current;
      const total = totalItems || rail.querySelectorAll(cardSelector).length;

      if (vel < -0.3) {
        scrollToCard(Math.min(total - 1, currentIdx + 1));
      } else if (vel > 0.3) {
        scrollToCard(Math.max(0, currentIdx - 1));
      } else if (Math.abs(vel) > 0.15) {
        rail.scrollBy({
          left: -vel * 200,
          behavior: 'smooth',
        });
      }
    };

    const onClickCapture = (e) => {
      if (hasMovedRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    rail.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    rail.addEventListener('click', onClickCapture, true);

    return () => {
      rail.removeEventListener('scroll', handleScroll);
      rail.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      rail.removeEventListener('click', onClickCapture, true);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enableMouseDrag, handleScroll, scrollToCard, totalItems, cardSelector]);

  return {
    railRef,
    activeIndex,
    scrollToCard,
    scrollPrev,
    scrollNext,
    canScrollPrev: activeIndex > 0,
    canScrollNext: totalItems ? activeIndex < totalItems - 1 : true,
  };
}
