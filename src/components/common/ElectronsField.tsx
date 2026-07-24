import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number };

const LINK_DIST = 130;
const POINTER_DIST = 180;
const DESKTOP_CAP = 90;
const MOBILE_CAP = 40;
const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 150;

type ElectronsFieldProps = {
  /** Multiplier applied to the computed node count. Defaults to 1. */
  density?: number;
  /** Render as a viewport-fixed layer (position: fixed) instead of filling
   *  the nearest positioned ancestor (position: absolute). */
  fixed?: boolean;
  className?: string;
};

/**
 * Signature interactive background: drifting nodes connected by distance-
 * faded lines, with the pointer acting as an attractor. Token-driven via
 * --electrons-node / --electrons-line (falls back to --accent), perf-safe
 * (DPR-capped, pauses when hidden/offscreen, node count scales with area)
 * and reduced-motion safe (single static frame, no listeners). Usage:
 *   <ElectronsField />                       // fills a `position: relative` parent
 *   <ElectronsField fixed density={0.6} />   // viewport-fixed, fewer nodes
 */
export function ElectronsField({ density = 1, fixed = false, className }: ElectronsFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let offscreen = false;
    let tabHidden = document.hidden;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const pointer = { x: -9999, y: -9999 };
    const colors = { node: '#4ade80', line: '#4ade80' };

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue('--accent').trim() || '#4ade80';
      colors.node = style.getPropertyValue('--electrons-node').trim() || accent;
      colors.line = style.getPropertyValue('--electrons-line').trim() || accent;
    }

    function measure() {
      if (fixed) return { w: window.innerWidth, h: window.innerHeight };
      const parent = canvas!.parentElement;
      return { w: parent?.clientWidth ?? 0, h: parent?.clientHeight ?? 0 };
    }

    function seed() {
      const cap = width < MOBILE_BREAKPOINT ? MOBILE_CAP : DESKTOP_CAP;
      const count = Math.max(0, Math.round(Math.min(cap, (width * height) / 16000) * density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function resize() {
      const { w, h } = measure();
      if (w <= 0 || h <= 0) return;
      width = w;
      height = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduceMotionQuery.matches) draw();
    }

    function debouncedResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
    }

    function draw() {
      const reduceMotion = reduceMotionQuery.matches;
      ctx!.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            ctx!.globalAlpha = (1 - dist / LINK_DIST) * 0.28;
            ctx!.strokeStyle = colors.line;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        let brighten = 0;
        if (!reduceMotion) {
          const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (pd < POINTER_DIST) {
            const t = 1 - pd / POINTER_DIST;
            brighten = t;
            ctx!.globalAlpha = t * 0.55;
            ctx!.strokeStyle = colors.line;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }

        ctx!.globalAlpha = 0.7 + brighten * 0.3;
        ctx!.fillStyle = colors.node;
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, 1.6 + brighten * 1.2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function maybeStart() {
      if (reduceMotionQuery.matches) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        draw();
        return;
      }
      if (tabHidden || offscreen || raf) return;
      raf = requestAnimationFrame(tick);
    }

    function tick() {
      draw();
      if (reduceMotionQuery.matches || tabHidden || offscreen) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function onVisibilityChange() {
      tabHidden = document.hidden;
      maybeStart();
    }

    function onReduceMotionChange() {
      maybeStart();
    }

    readColors();
    resize();
    maybeStart();

    // Re-read colors on theme change; the repo toggles `data-theme` on
    // <html> (see useTheme.ts) rather than dispatching a custom event.
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      maybeStart();
    });
    intersectionObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(debouncedResize);
    if (fixed) {
      resizeObserver.observe(document.documentElement);
    } else if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('pointermove', onPointer);
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reduceMotionQuery.addEventListener('change', onReduceMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reduceMotionQuery.removeEventListener('change', onReduceMotionChange);
    };
  }, [density, fixed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: fixed ? 'fixed' : 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
