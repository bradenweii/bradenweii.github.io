import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const shades = ' i1raen0bd8w';
const radius = 0.92;
const dishY = 0.38;
const dishX = -0.32;
const dishZ = Math.sqrt(1 - dishX ** 2 - dishY ** 2);
const dishThreshold = 0.908;
const tilt = 0.13;
const tiltCos = Math.cos(tilt);
const tiltSin = Math.sin(tilt);
const fullTurn = Math.PI * 2;
const stationRadius = (width: number, height: number) => Math.min(width, height) * 0.52 * radius;

function craterPosition(canvas: HTMLCanvasElement, angle: number) {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  // Invert the view-to-hull rotation to project the crater onto the screen.
  const horizontal = dishX * Math.cos(angle) + dishZ * Math.sin(angle);
  const depth = dishZ * Math.cos(angle) - dishX * Math.sin(angle);
  const scale = stationRadius(width, height);
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  return {
    x: centerX + scale * (horizontal * tiltCos - dishY * tiltSin),
    y: centerY - scale * (horizontal * tiltSin + dishY * tiltCos),
    hullMask: depth < 0
      ? `radial-gradient(circle at ${centerX}px ${centerY}px, transparent ${scale}px, black ${scale + 1}px)`
      : 'none',
  };
}

async function fetchClickTotal(action: 'get' | 'hit', signal?: AbortSignal): Promise<number> {
  const response = await fetch(`https://abacus.jasoncameron.dev/${action}/bradenweii-github-io/visits`, {
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error('Could not load the click total');
  const { value } = await response.json();
  if (typeof value !== 'number') throw new Error('Invalid click total');
  return value;
}

type LaserBurst = ReturnType<typeof craterPosition> & {
  rays: { bearing: number; delay: number }[];
};

function drawStation(ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) {
  const scale = Math.min(width, height) * 0.52;
  const cellWidth = Math.max(2.2, scale / 46);
  const cellHeight = cellWidth * 1.48;
  const columns = Math.floor(width / cellWidth);
  const rows = Math.floor(height / cellHeight);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  ctx.clearRect(0, 0, width, height);
  ctx.font = `${cellHeight}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < rows; row++) {
    const py = (row + 0.5 - rows / 2) * cellHeight;
    for (let col = 0; col < columns; col++) {
      const px = (col + 0.5 - columns / 2) * cellWidth;
      const x = px / scale;
      const y = -py / scale;
      const distance = x * x + y * y;

      if (distance > radius * radius) continue;

      const z = Math.sqrt(radius * radius - distance) / radius;
      const surfaceX = x / radius;
      const surfaceY = y / radius;
      const tiltedX = surfaceX * tiltCos + surfaceY * tiltSin;
      const latitude = surfaceY * tiltCos - surfaceX * tiltSin;
      const localX = tiltedX * cos - z * sin;
      const localZ = tiltedX * sin + z * cos;
      const longitude = Math.atan2(localX, localZ);
      const dishFacing = localX * dishX + latitude * dishY + localZ * dishZ;
      const panelRow = Math.floor((Math.asin(Math.max(-1, Math.min(1, latitude))) + Math.PI / 2) * 52);
      const panelCol = Math.floor((longitude + Math.PI) * 72);
      const grain = ((panelRow * 113 + panelCol * 67 + panelRow * panelCol * 11) % 29) / 29;
      const offset = panelCol + Math.floor(panelRow / 7) * 5;
      const seam = panelRow % 7 === 0 || offset % 14 === 0;
      const plating = (Math.floor(offset / 14) * 17 + Math.floor(panelRow / 7) * 11) % 7;

      // Broken plating is fixed in hull coordinates, including the staggered ends of exposed decks.
      const deckNoise = ((panelRow * 43 + panelRow * panelRow * 17) % 53) / 53;
      const tornEdge = (deckNoise - 0.5) * 0.29;
      const upperBreach = 0.65 - 2.1 * (latitude - 0.52) ** 2 - Math.abs(longitude - 1.34);
      const lowerBreach = 0.56 - 3 * (latitude + 0.48) ** 2 - Math.abs(longitude - 1.68);
      const breach = Math.max(upperBreach, lowerBreach) + tornEdge;
      const broken = Math.abs(latitude) > 0.085 && dishFacing <= dishThreshold && breach > 0;
      const exposedDeck = panelRow % 7 <= 1 && grain < 0.71;
      const support = panelCol % 23 === 0 && grain < 0.64;
      if (broken && !exposedDeck && !support) continue;

      let light = 0.16 + Math.max(0, -surfaceX * 0.5 + surfaceY * 0.66 + z * 0.42) * 0.68;
      light += (grain - 0.5) * 0.2 + (plating - 3) * 0.024 - (seam ? 0.16 : 0);
      const isWindow = panelRow % 7 === 2 && offset % 14 >= 8 && offset % 14 <= 10 && grain > 0.7;
      if (isWindow) light += 0.25;

      const equator = Math.abs(latitude);
      if (equator < 0.056) {
        light *= equator < 0.031 ? 0.18 : 0.88;
        if (equator < 0.022 && offset % 12 === 0) light += 0.38;
      }
      if (dishFacing > dishThreshold) {
        const dishRadius = Math.sqrt(Math.max(0, (1 - dishFacing) / (1 - dishThreshold)));
        const bowlLight = (localX - dishX * dishFacing) * 0.78 - (latitude - dishY * dishFacing) * 0.85;
        const ring = Math.abs(Math.sin(dishRadius * 4 * Math.PI)) < 0.19;
        if (dishRadius > 0.95) light = 0.45 + light * 0.55;
        else light = 0.10 + grain * 0.07 + Math.max(0, bowlLight) * 0.85 + (ring ? 0.08 : 0);
        if (dishRadius < 0.13) light = 0.84 - dishRadius * 1.8;
      }

      if (broken) {
        light = 0.21 + grain * 0.17 + (breach < 0.14 ? 0.2 : 0);
      }

      const index = Math.round(Math.max(0.08, Math.min(1, light)) * (shades.length - 1));
      ctx.fillStyle = light > 0.62 ? '#e5edf4' : light > 0.34 ? '#afbfcd' : light > 0.19 ? '#8495a5' : '#586b7d';
      ctx.fillText(shades[index], width / 2 + px, height / 2 + py);
    }
  }
}

export function AsciiDeathStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const laserFanRef = useRef<HTMLDivElement>(null);
  const laserOverlayRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [burst, setBurst] = useState<LaserBurst | null>(null);
  const [clickTotal, setClickTotal] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchClickTotal('get', controller.signal)
      .then(total => setClickTotal(current => Math.max(current ?? 0, total)))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!burst) return;
    const timeout = window.setTimeout(() => setBurst(null), 1700);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  const fire = () => {
    if (burst) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const raySpacing = fullTurn / 6;
    const phase = Math.random() * raySpacing;
    setBurst({
      ...craterPosition(canvas, angle.current),
      rays: Array.from({ length: 6 }, (_, index) => ({
        bearing: phase + (index + (Math.random() - 0.5) * 0.8) * raySpacing,
        delay: Math.round(Math.random() * 250),
      })),
    });
    fetchClickTotal('hit')
      .then(total => setClickTotal(current => Math.max(current ?? 0, total)))
      .catch(() => {});
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;

    const positionLaserFan = () => {
      const fan = laserFanRef.current;
      const overlay = laserOverlayRef.current;
      if (!fan || !overlay) return;
      const { x, y, hullMask } = craterPosition(canvas, angle.current);
      fan.style.left = `${x}px`;
      fan.style.top = `${y}px`;
      overlay.style.maskImage = hullMask;
    };

    const resize = () => {
      ({ width, height } = canvas.getBoundingClientRect());
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawStation(ctx, width, height, angle.current);
      positionLaserFan();
    };

    const tick = (now: number) => {
      if (!previousTime) previousTime = now;
      const elapsed = now - previousTime;
      if (elapsed >= 1000 / 24) {
        angle.current = (angle.current + Math.min(elapsed, 80) * 0.00024) % fullTurn;
        previousTime = now;
        drawStation(ctx, width, height, angle.current);
        positionLaserFan();
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('scroll', positionLaserFan, true);
    resize();
    if (!paused) frame = requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', positionLaserFan, true);
      cancelAnimationFrame(frame);
    };
  }, [paused]);

  return (
    <figure className="w-full max-w-[460px]">
      <button type="button" className="death-star-trigger block w-full" onClick={fire} aria-label="Fire the Death Star lasers" aria-disabled={Boolean(burst)}>
        <canvas ref={canvasRef} aria-hidden="true" className="block aspect-[5/4] w-full" />
      </button>
      {burst && createPortal(
        <div ref={laserOverlayRef} className="death-star-lasers" style={{ maskImage: burst.hullMask }} aria-hidden="true">
          <div ref={laserFanRef} className="death-star-laser-fan" style={{ left: burst.x, top: burst.y }}>
            {burst.rays.map(({ bearing, delay }) => (
              <span
                key={bearing}
                className="death-star-laser-ray"
                style={{
                  '--laser-bearing': `${bearing}rad`,
                  '--laser-delay': `${delay}ms`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>,
        document.body
      )}
      <figcaption className="mt-2 flex items-center justify-between text-xs text-[#aab4bf]">
        <span className="tabular-nums" aria-live="polite">
          {clickTotal === null ? 'Click the Death Star' : `${clickTotal.toLocaleString()} ${clickTotal === 1 ? 'click' : 'clicks'}`}
        </span>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="min-h-[32px] px-1 underline underline-offset-4 hover:text-white"
        >
          {paused ? 'Play rotation' : 'Pause rotation'}
        </button>
      </figcaption>
    </figure>
  );
}
