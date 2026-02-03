'use client';

/**
 * HERO SECTION - Ink Diffusion Homepage
 *
 * Elegant quill with detailed feather slowly appearing, writing silver calligraphy.
 * Rich visual with flowing ink strokes emanating from the quill nib.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';

interface FlowingStroke {
  points: { x: number; y: number; pressure: number }[];
  progress: number;
  speed: number;
  baseWidth: number;
  opacity: number;
  hue: number;
}

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  angle: number;
  speed: number;
}

export const HeroSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<FlowingStroke[]>([]);
  const particlesRef = useRef<InkParticle[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const [quillVisible, setQuillVisible] = useState(0);
  const quillPosRef = useRef({ x: 0, y: 0, angle: -35 });

  // Generate flowing calligraphic path from quill position
  const generateStrokeFromQuill = useCallback((
    startX: number,
    startY: number,
    width: number,
    height: number
  ): { x: number; y: number; pressure: number }[] => {
    const points: { x: number; y: number; pressure: number }[] = [];
    let x = startX;
    let y = startY;
    let angle = Math.random() * Math.PI * 0.3 - Math.PI * 0.15 + Math.PI * 0.1;

    const numPoints = 120 + Math.floor(Math.random() * 80);

    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;

      // Calligraphic movement
      const wave1 = Math.sin(t * Math.PI * 4) * 25;
      const wave2 = Math.cos(t * Math.PI * 3) * 15;
      const loopPhase = t * Math.PI * 5;
      const loopX = Math.sin(loopPhase) * 20 * Math.sin(t * Math.PI);
      const loopY = Math.cos(loopPhase * 0.6) * 12;

      // Pressure for thick/thin
      const pressure = 0.25 + Math.abs(Math.sin(t * Math.PI * 6)) * 0.55 +
                       Math.sin(t * Math.PI * 2.5) * 0.2;

      angle += Math.sin(t * Math.PI * 5) * 0.12 + (Math.random() - 0.5) * 0.08;

      const speed = 5 + Math.sin(t * Math.PI * 1.5) * 2;
      x += Math.cos(angle) * speed + wave1 * 0.08 + loopX * 0.25;
      y += Math.sin(angle) * speed * 0.4 + wave2 * 0.08 + loopY * 0.15;

      // Bounds
      if (x < width * 0.1) x = width * 0.1;
      if (x > width * 0.95) x = width * 0.95;
      if (y < height * 0.05) y = height * 0.05;
      if (y > height * 0.95) y = height * 0.95;

      points.push({ x, y, pressure: Math.max(0.15, Math.min(1, pressure)) });
    }

    return points;
  }, []);

  // Initialize strokes
  const initializeStrokes = useCallback((width: number, height: number, quillX: number, quillY: number) => {
    const strokes: FlowingStroke[] = [];

    for (let i = 0; i < 6; i++) {
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 30;

      strokes.push({
        points: generateStrokeFromQuill(
          quillX + offsetX,
          quillY + offsetY,
          width,
          height
        ),
        progress: i * 0.15,
        speed: 0.003 + Math.random() * 0.002,
        baseWidth: 3 + Math.random() * 5,
        opacity: 0.4 + Math.random() * 0.4,
        hue: 210 + Math.random() * 20,
      });
    }

    return strokes;
  }, [generateStrokeFromQuill]);

  // Draw mercury stroke
  const drawStroke = useCallback((
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number; pressure: number }[],
    startIdx: number,
    endIdx: number,
    baseWidth: number,
    opacity: number,
    time: number,
    hue: number
  ) => {
    if (endIdx - startIdx < 2) return;

    ctx.save();

    const shimmer = Math.sin(time * 0.025) * 0.15;

    for (let i = startIdx + 1; i < endIdx - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];

      const gradient = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
      gradient.addColorStop(0, `hsla(${hue}, 18%, ${88 + shimmer * 10}%, ${opacity * 0.9})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 22%, ${78}%, ${opacity})`);
      gradient.addColorStop(1, `hsla(${hue}, 25%, ${68}%, ${opacity * 0.85})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = baseWidth * p1.pressure;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `hsla(${hue}, 15%, 85%, ${opacity * 0.4})`;
      ctx.shadowBlur = 8;

      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      ctx.stroke();
    }

    // Highlight
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `hsla(0, 0%, 100%, ${opacity * 0.35 + shimmer * 0.1})`;
    ctx.lineWidth = baseWidth * 0.12;

    ctx.beginPath();
    for (let i = startIdx + 1; i < endIdx - 1; i += 4) {
      const p = points[i];
      const offset = baseWidth * p.pressure * 0.25;
      if (i === startIdx + 1) {
        ctx.moveTo(p.x - offset, p.y - offset);
      } else {
        ctx.lineTo(p.x - offset, p.y - offset);
      }
    }
    ctx.stroke();

    ctx.restore();
  }, []);

  // Main animation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    timeRef.current++;

    // Update quill position
    const quillBaseX = width * 0.7;
    const quillBaseY = height * 0.35;
    const wobble = Math.sin(timeRef.current * 0.03) * 3;
    const wobbleY = Math.cos(timeRef.current * 0.025) * 2;
    quillPosRef.current = {
      x: quillBaseX + wobble,
      y: quillBaseY + wobbleY,
      angle: -35 + Math.sin(timeRef.current * 0.02) * 2
    };

    // Quill fade in
    if (quillVisible < 1) {
      setQuillVisible(prev => Math.min(1, prev + 0.008));
    }

    // Initialize strokes
    if (strokesRef.current.length === 0 && quillVisible > 0.3) {
      strokesRef.current = initializeStrokes(width, height, quillPosRef.current.x, quillPosRef.current.y + 80);
    }

    // Clear
    ctx.fillStyle = tokens.colors.paper.cream;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Draw strokes
    strokesRef.current.forEach((stroke) => {
      stroke.progress += stroke.speed;
      if (stroke.progress > 1.5) {
        stroke.progress = 0;
        stroke.points = generateStrokeFromQuill(
          quillPosRef.current.x + (Math.random() - 0.5) * 40,
          quillPosRef.current.y + 80 + (Math.random() - 0.5) * 20,
          width,
          height
        );
      }

      const totalPoints = stroke.points.length;
      const visibleLength = Math.floor(totalPoints * 0.35);
      const currentEnd = Math.floor(stroke.progress * totalPoints * 1.3);
      const currentStart = Math.max(0, currentEnd - visibleLength);
      const actualEnd = Math.min(currentEnd, totalPoints);

      if (actualEnd > currentStart + 2) {
        drawStroke(
          ctx,
          stroke.points,
          currentStart,
          actualEnd,
          stroke.baseWidth,
          stroke.opacity * Math.min(1, quillVisible * 2),
          timeRef.current,
          stroke.hue
        );

        // Particles from stroke tip
        if (Math.random() < 0.2 && actualEnd < totalPoints) {
          const tip = stroke.points[actualEnd - 1];
          particlesRef.current.push({
            x: tip.x,
            y: tip.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5,
            size: 1.5 + Math.random() * 2.5,
            opacity: 0.5 + Math.random() * 0.4,
            life: 0,
            maxLife: 50 + Math.random() * 30,
          });
        }
      }
    });

    // Draw particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.opacity *= 0.975;

      if (p.life >= p.maxLife) return false;

      const lifeRatio = 1 - p.life / p.maxLife;

      ctx.save();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(240, 245, 250, ${p.opacity * lifeRatio})`);
      gradient.addColorStop(0.5, `rgba(200, 210, 220, ${p.opacity * lifeRatio * 0.7})`);
      gradient.addColorStop(1, `rgba(160, 175, 190, ${p.opacity * lifeRatio * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.shadowColor = `rgba(220, 230, 240, ${p.opacity * lifeRatio * 0.5})`;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      return true;
    });

    // Sparkles around quill
    if (timeRef.current % 8 === 0 && quillVisible > 0.5) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 100;
      sparklesRef.current.push({
        x: quillPosRef.current.x + Math.cos(angle) * dist,
        y: quillPosRef.current.y + Math.sin(angle) * dist,
        size: 1 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02,
      });
    }

    // Draw sparkles
    sparklesRef.current = sparklesRef.current.filter((s) => {
      s.opacity -= 0.008;
      s.angle += s.speed;

      if (s.opacity <= 0) return false;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.shadowColor = `rgba(255, 255, 255, ${s.opacity * 0.8})`;
      ctx.shadowBlur = 6;

      // 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const r = i % 2 === 0 ? s.size : s.size * 0.3;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      return true;
    });

    // Ink drip from nib
    if (timeRef.current % 60 === 0 && quillVisible > 0.8) {
      const nibX = quillPosRef.current.x + 45;
      const nibY = quillPosRef.current.y + 85;
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: nibX + (Math.random() - 0.5) * 8,
          y: nibY + Math.random() * 5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 1 + Math.random() * 2,
          size: 2 + Math.random() * 3,
          opacity: 0.7 + Math.random() * 0.3,
          life: 0,
          maxLife: 70 + Math.random() * 40,
        });
      }
    }

    ctx.restore();

    animationRef.current = requestAnimationFrame(animate);
  }, [quillVisible, initializeStrokes, generateStrokeFromQuill, drawStroke]);

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      strokesRef.current = [];
      timeRef.current = 0;
      setQuillVisible(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <section className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Canvas for ink strokes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: tokens.colors.paper.cream }}
      />

      {/* Detailed Quill SVG */}
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          right: '15%',
          top: '20%',
          opacity: quillVisible,
          transform: `rotate(${quillPosRef.current.angle}deg) scale(${0.8 + quillVisible * 0.2})`,
          transition: 'opacity 0.1s ease-out',
          filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.15)) drop-shadow(0 8px 16px rgba(0,0,0,0.1))`,
        }}
      >
        <svg width="320" height="400" viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Feather Shaft Gradient */}
          <defs>
            <linearGradient id="shaftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E4E0" />
              <stop offset="30%" stopColor="#D4CFC8" />
              <stop offset="60%" stopColor="#C8C2BA" />
              <stop offset="100%" stopColor="#B8B0A5" />
            </linearGradient>
            <linearGradient id="shaftHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nibGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A962" />
              <stop offset="40%" stopColor="#A8893F" />
              <stop offset="100%" stopColor="#8B7332" />
            </linearGradient>
            <linearGradient id="nibHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8D9A0" />
              <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F5F3F0" />
              <stop offset="50%" stopColor="#E8E4E0" />
              <stop offset="100%" stopColor="#D8D4CE" />
            </linearGradient>
            <linearGradient id="inkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A5568" />
              <stop offset="100%" stopColor="#2D3748" />
            </linearGradient>
            <filter id="featherShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Main feather body - left side barbs */}
          <g filter="url(#featherShadow)">
            {/* Left barbs - detailed feather texture */}
            <path d="M 160 30 Q 127 32 94 23" stroke="url(#featherGradient)" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 160 40 Q 124 43 88 33" stroke="url(#featherGradient)" strokeWidth="1.47" fill="none" opacity="0.84" />
            <path d="M 160 50 Q 119 54 78 44" stroke="url(#featherGradient)" strokeWidth="1.44" fill="none" opacity="0.92" />
            <path d="M 160 60 Q 114 65 68 55" stroke="url(#featherGradient)" strokeWidth="1.41" fill="none" opacity="0.91" />
            <path d="M 160 70 Q 110 76 60 66" stroke="url(#featherGradient)" strokeWidth="1.38" fill="none" opacity="0.82" />
            <path d="M 160 80 Q 108 87 56 77" stroke="url(#featherGradient)" strokeWidth="1.35" fill="none" opacity="0.7" />
            <path d="M 160 90 Q 107 98 54 88" stroke="url(#featherGradient)" strokeWidth="1.32" fill="none" opacity="0.59" />
            <path d="M 160 100 Q 108 108 56 98" stroke="url(#featherGradient)" strokeWidth="1.29" fill="none" opacity="0.54" />
            <path d="M 160 110 Q 110 118 60 108" stroke="url(#featherGradient)" strokeWidth="1.26" fill="none" opacity="0.56" />
            <path d="M 160 120 Q 113 127 66 117" stroke="url(#featherGradient)" strokeWidth="1.23" fill="none" opacity="0.65" />
            <path d="M 160 130 Q 116 136 72 126" stroke="url(#featherGradient)" strokeWidth="1.2" fill="none" opacity="0.77" />
            <path d="M 160 140 Q 118 144 76 135" stroke="url(#featherGradient)" strokeWidth="1.17" fill="none" opacity="0.88" />
            <path d="M 160 150 Q 120 152 80 144" stroke="url(#featherGradient)" strokeWidth="1.14" fill="none" opacity="0.94" />
            <path d="M 160 160 Q 122 160 84 153" stroke="url(#featherGradient)" strokeWidth="1.11" fill="none" opacity="0.92" />
            <path d="M 160 170 Q 124 168 88 162" stroke="url(#featherGradient)" strokeWidth="1.08" fill="none" opacity="0.84" />
            <path d="M 160 180 Q 126 177 92 172" stroke="url(#featherGradient)" strokeWidth="1.05" fill="none" opacity="0.72" />
            <path d="M 160 190 Q 128 186 96 182" stroke="url(#featherGradient)" strokeWidth="1.02" fill="none" opacity="0.6" />
            <path d="M 160 200 Q 130 196 100 192" stroke="url(#featherGradient)" strokeWidth="0.99" fill="none" opacity="0.52" />
            <path d="M 160 210 Q 132 206 104 202" stroke="url(#featherGradient)" strokeWidth="0.96" fill="none" opacity="0.5" />
            <path d="M 160 220 Q 134 217 108 213" stroke="url(#featherGradient)" strokeWidth="0.93" fill="none" opacity="0.55" />
            <path d="M 160 230 Q 136 228 112 224" stroke="url(#featherGradient)" strokeWidth="0.9" fill="none" opacity="0.66" />
            <path d="M 160 240 Q 138 238 116 235" stroke="url(#featherGradient)" strokeWidth="0.87" fill="none" opacity="0.78" />
            <path d="M 160 250 Q 140 248 120 246" stroke="url(#featherGradient)" strokeWidth="0.84" fill="none" opacity="0.89" />
            <path d="M 160 260 Q 142 258 124 256" stroke="url(#featherGradient)" strokeWidth="0.81" fill="none" opacity="0.95" />
            <path d="M 160 270 Q 144 268 128 266" stroke="url(#featherGradient)" strokeWidth="0.78" fill="none" opacity="0.93" />

            {/* Right barbs */}
            <path d="M 160 30 Q 190 32 220 26" stroke="url(#featherGradient)" strokeWidth="1.5" fill="none" opacity="0.65" />
            <path d="M 160 40 Q 193 43 226 36" stroke="url(#featherGradient)" strokeWidth="1.47" fill="none" opacity="0.77" />
            <path d="M 160 50 Q 197 54 234 47" stroke="url(#featherGradient)" strokeWidth="1.44" fill="none" opacity="0.88" />
            <path d="M 160 60 Q 200 65 240 58" stroke="url(#featherGradient)" strokeWidth="1.41" fill="none" opacity="0.94" />
            <path d="M 160 70 Q 202 76 244 69" stroke="url(#featherGradient)" strokeWidth="1.38" fill="none" opacity="0.93" />
            <path d="M 160 80 Q 203 87 246 80" stroke="url(#featherGradient)" strokeWidth="1.35" fill="none" opacity="0.85" />
            <path d="M 160 90 Q 203 98 246 91" stroke="url(#featherGradient)" strokeWidth="1.32" fill="none" opacity="0.73" />
            <path d="M 160 100 Q 202 108 244 101" stroke="url(#featherGradient)" strokeWidth="1.29" fill="none" opacity="0.6" />
            <path d="M 160 110 Q 200 118 240 111" stroke="url(#featherGradient)" strokeWidth="1.26" fill="none" opacity="0.51" />
            <path d="M 160 120 Q 197 127 234 121" stroke="url(#featherGradient)" strokeWidth="1.23" fill="none" opacity="0.48" />
            <path d="M 160 130 Q 194 136 228 130" stroke="url(#featherGradient)" strokeWidth="1.2" fill="none" opacity="0.52" />
            <path d="M 160 140 Q 191 144 222 139" stroke="url(#featherGradient)" strokeWidth="1.17" fill="none" opacity="0.62" />
            <path d="M 160 150 Q 188 152 216 148" stroke="url(#featherGradient)" strokeWidth="1.14" fill="none" opacity="0.74" />
            <path d="M 160 160 Q 186 160 212 157" stroke="url(#featherGradient)" strokeWidth="1.11" fill="none" opacity="0.86" />
            <path d="M 160 170 Q 184 168 208 166" stroke="url(#featherGradient)" strokeWidth="1.08" fill="none" opacity="0.93" />
            <path d="M 160 180 Q 182 177 204 175" stroke="url(#featherGradient)" strokeWidth="1.05" fill="none" opacity="0.95" />
            <path d="M 160 190 Q 180 186 200 184" stroke="url(#featherGradient)" strokeWidth="1.02" fill="none" opacity="0.9" />
            <path d="M 160 200 Q 179 196 198 194" stroke="url(#featherGradient)" strokeWidth="0.99" fill="none" opacity="0.8" />
            <path d="M 160 210 Q 178 206 196 204" stroke="url(#featherGradient)" strokeWidth="0.96" fill="none" opacity="0.68" />
            <path d="M 160 220 Q 177 217 194 215" stroke="url(#featherGradient)" strokeWidth="0.93" fill="none" opacity="0.56" />
            <path d="M 160 230 Q 176 228 192 226" stroke="url(#featherGradient)" strokeWidth="0.9" fill="none" opacity="0.48" />
            <path d="M 160 240 Q 175 238 190 237" stroke="url(#featherGradient)" strokeWidth="0.87" fill="none" opacity="0.46" />
            <path d="M 160 250 Q 174 248 188 247" stroke="url(#featherGradient)" strokeWidth="0.84" fill="none" opacity="0.52" />
            <path d="M 160 260 Q 173 258 186 257" stroke="url(#featherGradient)" strokeWidth="0.81" fill="none" opacity="0.62" />
            <path d="M 160 270 Q 172 268 184 267" stroke="url(#featherGradient)" strokeWidth="0.78" fill="none" opacity="0.74" />

            {/* Secondary fine barbs for texture */}
            <path d="M 160 25 L 120 23" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 30 L 200 28" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 36 L 115 34" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 41 L 205 39" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 47 L 110 45" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 52 L 210 50" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 58 L 108 56" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 63 L 212 61" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 69 L 105 67" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 74 L 215 72" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 80 L 103 78" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 85 L 217 83" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 91 L 105 89" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 96 L 215 94" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 102 L 108 100" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 107 L 212 105" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 113 L 112 111" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 118 L 208 116" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 124 L 118 122" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 129 L 202 127" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 135 L 125 133" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 140 L 195 138" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 146 L 130 144" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 151 L 190 149" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 157 L 135 155" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 162 L 185 160" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 168 L 138 166" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 173 L 182 171" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 179 L 140 177" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
            <path d="M 160 184 L 180 182" stroke="#E0DCD5" strokeWidth="0.5" opacity="0.4" />
          </g>

          {/* Central shaft */}
          <path
            d="M 158 10 Q 159 150 160 300 L 162 300 Q 161 150 160 10 Z"
            fill="url(#shaftGradient)"
          />
          <path
            d="M 158.5 10 Q 159 150 159.5 300"
            stroke="url(#shaftHighlight)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Nib holder */}
          <ellipse cx="160" cy="305" rx="8" ry="4" fill="#8B7332" />
          <ellipse cx="160" cy="303" rx="6" ry="3" fill="#A8893F" />

          {/* Metal nib */}
          <path
            d="M 154 305 L 160 380 L 166 305 Q 163 310 160 310 Q 157 310 154 305 Z"
            fill="url(#nibGradient)"
          />
          <path
            d="M 157 308 L 160 370 L 163 308"
            stroke="url(#nibHighlight)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          {/* Nib slit */}
          <line x1="160" y1="320" x2="160" y2="375" stroke="#5D4E2A" strokeWidth="1" />
          {/* Nib hole */}
          <circle cx="160" cy="318" r="2" fill="#5D4E2A" />

          {/* Ink on nib */}
          <path
            d="M 158 355 Q 160 385 162 355"
            fill="url(#inkGradient)"
            opacity="0.8"
          />
          <ellipse cx="160" cy="378" rx="3" ry="4" fill="#2D3748" opacity="0.9" />

          {/* Feather top flourish */}
          <path
            d="M 160 10 Q 150 -5 145 15 Q 155 5 160 10"
            fill="#E8E4E0"
            opacity="0.8"
          />
          <path
            d="M 160 10 Q 170 -8 175 12 Q 165 3 160 10"
            fill="#E8E4E0"
            opacity="0.7"
          />

          {/* Subtle shine effects */}
          <ellipse cx="158" cy="100" rx="1" ry="20" fill="white" opacity="0.3" />
          <ellipse cx="159" cy="200" rx="0.8" ry="15" fill="white" opacity="0.2" />
        </svg>
      </div>

      {/* Ambient glow behind quill */}
      <div
        className="absolute pointer-events-none hidden lg:block rounded-full blur-3xl"
        style={{
          right: '10%',
          top: '15%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, rgba(201, 169, 98, ${quillVisible * 0.1}) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-12 sm:w-16 h-px" style={{ background: tokens.colors.ink[700] }} />
          <span
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            The Future of Content
          </span>
        </div>

        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] mb-6 sm:mb-8 max-w-4xl"
          style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
        >
          Words that
          <br />
          <span style={{ fontStyle: 'italic', color: tokens.colors.ink[700] }}>
            resonate.
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl lg:text-2xl max-w-xl mb-8 sm:mb-12 leading-relaxed backdrop-blur-[2px] rounded-lg"
          style={{
            fontFamily: tokens.fonts.serif,
            color: tokens.colors.text.secondary,
            background: 'rgba(253, 251, 247, 0.8)',
            padding: '12px 0',
          }}
        >
          Content that sounds like you wrote it—because we learned how you write.
          Share your voice; we'll match it in everything we create.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <button
            onClick={() => session ? router.push('/dashboard/projects/new') : router.push('/signup')}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all hover:scale-105 relative z-20"
            style={{
              background: tokens.colors.ink[700],
              color: '#fff',
              boxShadow: `0 20px 40px ${tokens.colors.ink[700]}30`,
            }}
          >
            {session ? 'Create New Project' : 'Start Creating'}
          </button>
          <a
            href="#style-learning"
            className="flex items-center gap-3 text-base sm:text-lg transition-all hover:gap-4 relative z-20"
            style={{ color: tokens.colors.text.secondary }}
          >
            <span
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
              style={{ borderColor: tokens.colors.ink[300], background: 'rgba(253, 251, 247, 0.9)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.ink[700]} strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <span style={{ fontFamily: tokens.fonts.sans }}>See how it works</span>
          </a>
        </div>

        <div
          className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-16 mt-16 sm:mt-20 pt-8 sm:pt-12 border-t backdrop-blur-sm relative z-10 rounded-xl"
          style={{
            borderColor: tokens.colors.paper.border,
            background: 'rgba(253, 251, 247, 0.92)',
            padding: '24px',
            marginLeft: '-12px',
            marginRight: '-12px',
          }}
        >
          {[
            { number: '50K+', label: 'Words crafted daily' },
            { number: '94%', label: 'Style match accuracy' },
            { number: '<24h', label: 'Average delivery' },
          ].map((stat, i) => (
            <div key={i}>
              <p
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-1 sm:mb-2"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}
              >
                {stat.number}
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
