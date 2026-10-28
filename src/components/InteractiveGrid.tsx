"use client";

import { useEffect, useRef } from "react";

/**
 * A soft square grid drawn on a canvas. Cells near the pointer light up in the
 * brand colour and fade out slowly, leaving a gentle trail. Purely decorative.
 */
export function InteractiveGrid({ cell = 44, color = "181, 80, 42", className = "" }: { cell?: number; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let glow = new Float32Array(0);
    let frame = 0;
    let running = false;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell);
      glow = new Float32Array(cols * Math.ceil(height / cell));
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < glow.length; i++) {
        const g = glow[i];
        if (g < 0.01) continue;
        const x = (i % cols) * cell;
        const y = Math.floor(i / cols) * cell;
        ctx!.fillStyle = `rgba(${color}, ${0.16 * g})`;
        ctx!.fillRect(x + 1, y + 1, cell - 2, cell - 2);
      }
      ctx!.strokeStyle = `rgba(${color}, 0.09)`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let x = 0.5; x <= width; x += cell) {
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
      }
      for (let y = 0.5; y <= height; y += cell) {
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
      }
      ctx!.stroke();
    }

    function tick() {
      let alive = false;
      for (let i = 0; i < glow.length; i++) {
        if (glow[i] > 0.01) {
          glow[i] *= 0.94;
          alive = true;
        } else glow[i] = 0;
      }
      draw();
      if (alive) frame = requestAnimationFrame(tick);
      else running = false;
    }

    function light(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      const cx = Math.floor((clientX - rect.left) / cell);
      const cy = Math.floor((clientY - rect.top) / cell);
      const rows = glow.length / cols;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const strength = dx === 0 && dy === 0 ? 1 : 0.35;
          const i = y * cols + x;
          glow[i] = Math.max(glow[i], strength);
        }
      }
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    }

    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => light(e.clientX, e.clientY);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduced) host.addEventListener("pointermove", onMove);
    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [cell, color]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
