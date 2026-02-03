'use client';

/**
 * GENERATION DEMO SECTION - Ink Diffusion Homepage
 *
 * Visual demonstration of the content generation process.
 * Auto-plays an animated simulation showing stages, ink effects,
 * and text appearing - gives visitors a premium preview.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tokens } from '../../primitives/design-tokens';
import { PlayIcon } from '../icons/InkIcons';

// Demo stages
const DEMO_STAGES = [
  { id: 'style', label: 'Analyzing Your Style' },
  { id: 'research', label: 'Researching Topic' },
  { id: 'outline', label: 'Creating Outline' },
  { id: 'writing', label: 'Crafting Content' },
  { id: 'polish', label: 'Final Polish' },
];

// Demo content that streams in
const DEMO_CONTENT = `# The Future of Sustainable Business

In today's rapidly evolving marketplace, sustainability isn't just a buzzword—it's become a fundamental business imperative that separates industry leaders from those left behind.

## Why Sustainability Matters Now

The shift toward sustainable practices has accelerated dramatically. Companies that embrace environmental responsibility are seeing tangible benefits: stronger brand loyalty, reduced operational costs, and access to new markets hungry for ethical alternatives.

**Consider these compelling statistics:**
- 73% of consumers willing to pay more for sustainable products
- Companies with strong ESG practices outperform peers by 4.8%
- Sustainable businesses attract top talent at 2x the rate

## Three Strategies for Immediate Impact

### 1. Supply Chain Transparency
Start by mapping your entire supply chain. Identify where waste occurs, where energy is consumed unnecessarily, and where ethical concerns might lurk...`;

export const GenerationDemoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Ink drops for background
  const inkDrops = [
    { x: 15, y: 20, size: 180, delay: 0, color: tokens.colors.ink[200] },
    { x: 75, y: 30, size: 220, delay: 1.5, color: tokens.colors.sage[200] },
    { x: 45, y: 70, size: 160, delay: 3, color: tokens.colors.ink[300] },
    { x: 85, y: 80, size: 200, delay: 2, color: tokens.colors.sage[300] },
  ];

  const resetDemo = useCallback(() => {
    setCurrentStageIndex(0);
    setDisplayedText('');
    setProgress(0);
  }, []);

  const runDemo = useCallback(() => {
    if (isPlaying) return;

    resetDemo();
    setIsPlaying(true);

    let charIndex = 0;
    let stageIndex = 0;
    const totalChars = DEMO_CONTENT.length;
    const charsPerStage = Math.floor(totalChars / DEMO_STAGES.length);

    const animate = () => {
      if (charIndex < totalChars) {
        // Update text
        const charsToAdd = Math.min(3, totalChars - charIndex); // Add 3 chars at a time
        charIndex += charsToAdd;
        setDisplayedText(DEMO_CONTENT.slice(0, charIndex));

        // Update progress
        setProgress(Math.round((charIndex / totalChars) * 100));

        // Update stage
        const newStageIndex = Math.min(
          Math.floor(charIndex / charsPerStage),
          DEMO_STAGES.length - 1
        );
        if (newStageIndex !== stageIndex) {
          stageIndex = newStageIndex;
          setCurrentStageIndex(stageIndex);
        }

        animationRef.current = setTimeout(animate, 25); // Speed of typing
      } else {
        // Demo complete
        setProgress(100);
        setTimeout(() => {
          setIsPlaying(false);
        }, 2000);
      }
    };

    animate();
  }, [isPlaying, resetDemo]);

  // Auto-play when section comes into view
  useEffect(() => {
    if (hasAutoPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayed) {
            setHasAutoPlayed(true);
            setTimeout(() => runDemo(), 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoPlayed, runDemo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20 relative overflow-hidden"
      style={{ background: tokens.colors.ink[800] }}
    >
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes inkBloom {
          0% { transform: scale(0.5) translate(-50%, -50%); opacity: 0; }
          30% { opacity: 0.4; }
          100% { transform: scale(2.5) translate(-50%, -50%); opacity: 0; }
        }
        @keyframes inkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .ink-drop-demo {
          animation: inkBloom 8s ease-out infinite;
        }
        .ink-cursor-demo {
          animation: inkCursor 1s ease-in-out infinite;
        }
        .progress-shimmer-demo {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Animated ink drops in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isPlaying && inkDrops.map((drop, i) => (
          <div
            key={i}
            className="ink-drop-demo absolute rounded-full"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              width: drop.size,
              height: drop.size,
              background: `radial-gradient(circle, ${drop.color} 0%, transparent 70%)`,
              animationDelay: `${drop.delay}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[400], fontFamily: tokens.fonts.sans }}
          >
            Live Preview
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.paper.cream }}
          >
            Watch the <em style={{ color: tokens.colors.sage[400] }}>magic</em> happen
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: tokens.colors.ink[300] }}
          >
            See how our multi-stage process transforms your brief into polished,
            style-matched content in real time.
          </p>
        </div>

        {/* Demo container */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: tokens.colors.paper.cream,
            boxShadow: `0 40px 80px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Demo header bar */}
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b"
            style={{ borderColor: tokens.colors.paper.border }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28CA41' }} />
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}
            >
              Content Generation — Premium Tier
            </span>
            <button
              onClick={() => {
                if (!isPlaying) {
                  runDemo();
                }
              }}
              disabled={isPlaying}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isPlaying ? tokens.colors.ink[100] : tokens.colors.ink[700],
                color: isPlaying ? tokens.colors.ink[500] : '#fff',
              }}
            >
              {isPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <PlayIcon size={14} color="currentColor" />
                  Replay Demo
                </>
              )}
            </button>
          </div>

          {/* Main demo area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px] sm:min-h-[500px]">
            {/* Stages sidebar */}
            <aside
              className="lg:col-span-3 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: tokens.colors.paper.border }}
            >
              <p
                className="text-xs uppercase tracking-[0.15em] mb-4"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Process Stages
              </p>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {DEMO_STAGES.map((stage, index) => {
                  const isActive = index === currentStageIndex;
                  const isComplete = index < currentStageIndex;

                  return (
                    <div
                      key={stage.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 flex-shrink-0 lg:flex-shrink"
                      style={{
                        background: isActive
                          ? tokens.colors.ink[100]
                          : isComplete
                          ? tokens.colors.sage[50]
                          : 'transparent',
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all flex-shrink-0"
                        style={{
                          background: isActive
                            ? tokens.colors.ink[700]
                            : isComplete
                            ? tokens.colors.sage[500]
                            : tokens.colors.ink[200],
                          color: isActive || isComplete ? '#fff' : tokens.colors.ink[500],
                        }}
                      >
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <span
                        className="text-sm whitespace-nowrap"
                        style={{
                          color: isActive
                            ? tokens.colors.text.primary
                            : isComplete
                            ? tokens.colors.sage[700]
                            : tokens.colors.text.muted,
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Content area */}
            <main className="lg:col-span-9 p-4 sm:p-8 relative">
              {/* Writing surface */}
              <div
                className="rounded-xl p-4 sm:p-6 min-h-[280px] sm:min-h-[350px] relative overflow-hidden"
                style={{
                  background: tokens.colors.paper.white,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                {/* Placeholder when not started */}
                {!displayedText && !isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p
                      className="text-center"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      Click &quot;Replay Demo&quot; to watch content generation
                    </p>
                  </div>
                )}

                {/* Content display */}
                <div
                  className="prose prose-sm sm:prose max-w-none"
                  style={{
                    fontFamily: tokens.fonts.serif,
                    color: tokens.colors.text.primary,
                  }}
                >
                  {displayedText.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h1
                          key={i}
                          className="text-xl sm:text-2xl font-light mb-4"
                          style={{ fontFamily: tokens.fonts.serif }}
                        >
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h2
                          key={i}
                          className="text-lg sm:text-xl font-light mt-6 mb-3"
                          style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}
                        >
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3
                          key={i}
                          className="text-base sm:text-lg font-medium mt-4 mb-2"
                          style={{ fontFamily: tokens.fonts.serif }}
                        >
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={i} className="font-semibold mt-4 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li
                          key={i}
                          className="ml-4 mb-1 text-sm sm:text-base"
                          style={{ color: tokens.colors.text.secondary }}
                        >
                          {line.replace('- ', '')}
                        </li>
                      );
                    }
                    if (line.trim()) {
                      return (
                        <p key={i} className="mb-3 text-sm sm:text-base leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}

                  {/* Typing cursor */}
                  {isPlaying && (
                    <span
                      className="ink-cursor-demo inline-block w-0.5 h-5 ml-0.5"
                      style={{ background: tokens.colors.ink[700] }}
                    />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 sm:mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {isPlaying ? DEMO_STAGES[currentStageIndex]?.label : 'Ready'}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: tokens.colors.ink[600] }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: tokens.colors.ink[100] }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${tokens.colors.ink[600]}, ${tokens.colors.sage[500]})`,
                    }}
                  >
                    {isPlaying && (
                      <div
                        className="progress-shimmer-demo absolute inset-0 w-1/3"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Bottom note */}
        <p
          className="text-center mt-8 text-sm"
          style={{ color: tokens.colors.ink[400] }}
        >
          This is a simulation. Actual generation includes your style profile and live research.
        </p>
      </div>
    </section>
  );
};

export default GenerationDemoSection;
