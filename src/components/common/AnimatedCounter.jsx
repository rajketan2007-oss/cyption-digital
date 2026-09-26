import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.6 }) {
  const elementRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const stringVal = String(value);
    const numMatch = stringVal.match(/[\d.]+/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numMatch[0]);
    const isDecimal = String(targetNum).includes('.');
    const decimals = isDecimal ? String(targetNum).split('.')[1].length : 0;

    const counterObj = { val: 0 };

    const anim = gsap.to(counterObj, {
      val: targetNum,
      duration: duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      },
      onUpdate: () => {
        setDisplayValue(counterObj.val.toFixed(decimals));
      }
    });

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [value, duration]);

  const stringVal = String(value);
  const numMatch = stringVal.match(/[\d.]+/);
  const leading = numMatch ? stringVal.slice(0, numMatch.index) : '';
  const trailing = numMatch ? stringVal.slice(numMatch.index + numMatch[0].length) : '';

  return (
    <span ref={elementRef} className="animated-counter">
      {prefix || leading}{displayValue}{suffix || trailing}
    </span>
  );
}
