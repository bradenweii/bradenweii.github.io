import React, { useEffect, useRef } from 'react';

export function MeteorField() {
  const meteorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const meteor = meteorRef.current;
    if (!meteor) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let flight: Animation | undefined;

    const launch = (event: MouseEvent) => {
      const target = event.target;
      if (
        motion.matches ||
        flight?.pending ||
        flight?.playState === 'running' ||
        !(target instanceof Element) ||
        !target.closest('.portfolio-space') ||
        target.closest('a, button, summary, input, select, textarea, [role="button"]')
      ) return;

      const { innerWidth: width, innerHeight: height } = window;
      const tailLength = 65 + Math.random() * 85;
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -12 : width + 12;
      const endX = fromLeft ? width + tailLength + 12 : -tailLength - 12;
      const startY = height * (0.1 + Math.random() * 0.65);
      const endY = height * (0.2 + Math.random() * 0.65);
      const angle = Math.atan2(endY - startY, endX - startX);
      const start = `translate(${startX}px, ${startY}px) rotate(${angle}rad)`;
      const end = `translate(${endX}px, ${endY}px) rotate(${angle}rad)`;

      meteor.style.width = `${tailLength}px`;
      flight = meteor.animate([
        { transform: start, opacity: 0 },
        { opacity: 0.85, offset: 0.12 },
        { opacity: 0.7, offset: 0.84 },
        { transform: end, opacity: 0 },
      ], { duration: Math.min(1900, Math.max(1100, width * 1.4)) });
    };

    const stopFlight = () => flight?.cancel();
    document.addEventListener('click', launch);
    motion.addEventListener('change', stopFlight);
    return () => {
      stopFlight();
      document.removeEventListener('click', launch);
      motion.removeEventListener('change', stopFlight);
    };
  }, []);

  return (
    <div className="portfolio-meteors" aria-hidden="true">
      <div ref={meteorRef} className="portfolio-meteor" />
    </div>
  );
}
