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
  const activeIndexRef = useRef(initialIndex);
  activeIndexRef.current = activeIndex;

  const isDraggingRef = useRef(false);
  const isTouchRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const isHorizontalScrollRef = useRef(null);
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
    scrollToCard(activeIndexRef.current - 1);
  }, [scrollToCard]);

  const scrollNext = useCallback(() => {
    scrollToCard(activeIndexRef.current + 1);
  }, [scrollToCard]);

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

    if (!enableMouseDrag) {
      return () => {
        rail.removeEventListener('scroll', handleScroll);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    // --- Touch Gesture Handling for Mobile Phones ---
    const onTouchStart = (e) => {
      if (e.target.closest('button, a, input, textarea, select')) return;
      const touch = e.touches[0];
      isDraggingRef.current = true;
      isTouchRef.current = true;
      hasMovedRef.current = false;
      isHorizontalScrollRef.current = null;
      startXRef.current = touch.pageX;
      startYRef.current = touch.pageY;
      scrollLeftRef.current = rail.scrollLeft;
      lastXRef.current = touch.pageX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
    };

    const onTouchMove = (e) => {
      if (!isDraggingRef.current || !isTouchRef.current) return;
      const touch = e.touches[0];
      const dx = touch.pageX - startXRef.current;
      const dy = touch.pageY - startYRef.current;

      // Determine directional intent on initial movement
      if (isHorizontalScrollRef.current === null) {
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isHorizontalScrollRef.current = Math.abs(dx) >= Math.abs(dy);
        }
      }

      // If user is scrolling vertically down the page, don't intervene
      if (isHorizontalScrollRef.current === false) return;

      if (isHorizontalScrollRef.current === true) {
        hasMovedRef.current = true;
        const now = Date.now();
        const dt = now - lastTimeRef.current;
        if (dt > 0) {
          velocityRef.current = (touch.pageX - lastXRef.current) / dt;
        }
        lastXRef.current = touch.pageX;
        lastTimeRef.current = now;
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current || !isTouchRef.current) return;
      isDraggingRef.current = false;
      isTouchRef.current = false;

      if (isHorizontalScrollRef.current === true && hasMovedRef.current) {
        const vel = velocityRef.current;
        const currentIdx = activeIndexRef.current;
        const total = totalItems || rail.querySelectorAll(cardSelector).length;

        // If flicked with velocity, smoothly glide to next or previous card
        if (vel < -0.25) {
          scrollToCard(Math.min(total - 1, currentIdx + 1));
        } else if (vel > 0.25) {
          scrollToCard(Math.max(0, currentIdx - 1));
        }
      }
      isHorizontalScrollRef.current = null;
    };

    // --- Desktop Mouse Drag Handling ---
    const onMouseDown = (e) => {
      if (e.target.closest('button, a, input, textarea, select')) return;
      isDraggingRef.current = true;
      isTouchRef.current = false;
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
      if (!isDraggingRef.current || isTouchRef.current) return;
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
      if (!isDraggingRef.current || isTouchRef.current) return;
      isDraggingRef.current = false;
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

    rail.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    rail.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    rail.addEventListener('click', onClickCapture, true);

    return () => {
      rail.removeEventListener('scroll', handleScroll);
      rail.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
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
