import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useSmoothCardsSlider
 * Provides ultra-smooth, hardware-accelerated card sliding for mobile touch
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
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef(null);

  // Smoothly scroll to a specific card index
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

    // On mobile, center the card; on desktop, align with container padding
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
    scrollToCard(activeIndex - 1);
  }, [activeIndex, scrollToCard]);

  const scrollNext = useCallback(() => {
    scrollToCard(activeIndex + 1);
  }, [activeIndex, scrollToCard]);

  // Update active index based on scroll position (high performance, no layout reflow)
  const handleScroll = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    animFrameRef.current = requestAnimationFrame(() => {
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

      setActiveIndex((prev) => {
        if (prev !== closest) {
          if (onIndexChange) onIndexChange(closest);
          return closest;
        }
        return prev;
      });
    });
  }, [cardSelector, onIndexChange]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Passive scroll listener for silky 120fps tracking
    rail.addEventListener('scroll', handleScroll, { passive: true });

    // Desktop mouse drag implementation
    if (!enableMouseDrag) {
      return () => {
        rail.removeEventListener('scroll', handleScroll);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    const onMouseDown = (e) => {
      // Don't drag if clicking buttons, links, or form controls
      if (e.target.closest('button, a, input, textarea, select')) return;

      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.pageX;
      scrollLeftRef.current = rail.scrollLeft;
      lastXRef.current = e.pageX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
      rail.style.cursor = 'grabbing';
      rail.style.scrollBehavior = 'auto'; // Instant response during direct drag
      rail.style.userSelect = 'none';
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const x = e.pageX;
      const diff = x - startXRef.current;

      if (Math.abs(diff) > 5) {
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
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      rail.style.cursor = 'grab';
      rail.style.scrollBehavior = 'smooth';
      rail.style.removeProperty('user-select');

      // Apply kinetic glide if dragged with velocity
      if (Math.abs(velocityRef.current) > 0.25) {
        const momentum = velocityRef.current * 280;
        rail.scrollBy({
          left: -momentum,
          behavior: 'smooth',
        });
      }
    };

    const onClickCapture = (e) => {
      // Prevent accidental clicks on child links if user was dragging
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
  }, [enableMouseDrag, handleScroll]);

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
