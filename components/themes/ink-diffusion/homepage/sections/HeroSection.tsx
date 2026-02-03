'use client';

/**
 * HERO SECTION - Ink Diffusion Homepage
 *
 * Premium live demo mockup showing content generation in action.
 * Features sophisticated typography and elegant frame design.
 * Fully responsive for mobile devices.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';

// Generation stages
const DEMO_STAGES = [
  { id: 'analyzing', label: 'Analyzing Style', shortLabel: 'Style' },
  { id: 'researching', label: 'Researching', shortLabel: 'Research' },
  { id: 'writing', label: 'Writing', shortLabel: 'Write' },
  { id: 'polishing', label: 'Polishing', shortLabel: 'Polish' },
];

// Human-sounding content
const DEMO_CONTENT = `I've been running my coffee shop for six years now, and honestly? The sustainability stuff started as pure economics. I was tired of watching money drain out of our compost bin every week—literally.

Here's what nobody tells you about going sustainable: the first three months will make you question everything. I remember standing in my stockroom at 2am, surrounded by biodegradable cups that cost twice as much, wondering if I'd made a terrible mistake.

But then something weird happened. Customers started... noticing. Not because we put up signs or posted about it on Instagram. They just felt it. The place felt different.

My regulars started bringing their own cups. Not because we offered a discount (we didn't, not yet), but because they wanted to be part of whatever we were building. One guy—Mark, gets a flat white every morning—actually thanked me for making it easier to do the right thing.

The money part took longer to work out than I expected. About eight months, if I'm honest. But here's what the business books don't tell you: sustainability isn't a line item. It's a slow restructuring of everything.`;

// Format content for blog display
const formatBlogContent = (text: string) => {
  return text.split('\n\n').map((paragraph, i) => {
    if (i === 0) {
      return { type: 'lead', content: paragraph };
    }
    return { type: 'paragraph', content: paragraph };
  });
};

export const HeroSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showBlogView, setShowBlogView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const runDemo = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    setHasStarted(true);
    setCurrentStageIndex(0);
    setDisplayedText('');
    setShowBlogView(false);

    let charIndex = 0;
    let stageIndex = 0;
    const totalChars = DEMO_CONTENT.length;

    setTimeout(() => {
      setCurrentStageIndex(1);
      setTimeout(() => {
        setCurrentStageIndex(2);

        const animate = () => {
          if (charIndex < totalChars) {
            const charsToAdd = 2 + Math.floor(Math.random() * 3);
            charIndex = Math.min(charIndex + charsToAdd, totalChars);
            setDisplayedText(DEMO_CONTENT.slice(0, charIndex));

            const progress = charIndex / totalChars;
            if (progress > 0.85 && stageIndex < 3) {
              stageIndex = 3;
              setCurrentStageIndex(3);
            }

            const lastChar = DEMO_CONTENT[charIndex - 1];
            const delay = ['.', '!', '?', ':'].includes(lastChar) ? 120 :
                         [',', ';'].includes(lastChar) ? 80 :
                         lastChar === '\n' ? 150 : 35;

            animationRef.current = setTimeout(animate, delay);
          } else {
            setTimeout(() => {
              setShowBlogView(true);
              setTimeout(() => {
                setIsPlaying(false);
              }, 3000);
            }, 800);
          }
        };

        animate();
      }, 1000);
    }, 1200);
  }, [isPlaying]);

  useEffect(() => {
    if (hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setTimeout(() => runDemo(), 800);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, runDemo]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const blogContent = formatBlogContent(displayedText);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 relative overflow-hidden"
      style={{ background: tokens.colors.paper.cream }}
    >
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .content-text {
          font-feature-settings: 'liga' 1, 'kern' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${tokens.colors.ink[600]} 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            right: '-20%',
            top: '-10%',
            background: `radial-gradient(circle, ${tokens.colors.ink[100]}25 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left column - Original styling */}
          <div className="pt-4 lg:pt-12">
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
              className="text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] mb-6 sm:mb-8"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
            >
              Words that
              <br />
              <span style={{ fontStyle: 'italic', color: tokens.colors.ink[700] }}>
                resonate.
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl lg:text-2xl max-w-xl mb-8 sm:mb-12 leading-relaxed"
              style={{
                fontFamily: tokens.fonts.serif,
                color: tokens.colors.text.secondary,
              }}
            >
              Content that sounds like you wrote it—because we learned how you write.
              Share your voice; we'll match it in everything we create.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <button
                onClick={() => session ? router.push('/dashboard/projects/new') : router.push('/signup')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all hover:scale-105 active:scale-100"
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
                className="flex items-center gap-3 text-base sm:text-lg transition-all hover:gap-4"
                style={{ color: tokens.colors.text.secondary }}
              >
                <span
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: tokens.colors.ink[300] }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.ink[700]} strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span style={{ fontFamily: tokens.fonts.sans }}>See how it works</span>
              </a>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t"
              style={{ borderColor: tokens.colors.paper.border }}
            >
              {[
                { number: '50K+', label: 'Words crafted daily' },
                { number: '94%', label: 'Style match accuracy' },
                { number: '<24h', label: 'Average delivery' },
              ].map((stat, i) => (
                <div key={i}>
                  <p
                    className="text-2xl sm:text-3xl lg:text-4xl font-light mb-1"
                    style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}
                  >
                    {stat.number}
                  </p>
                  <p
                    className="text-[10px] sm:text-xs lg:text-sm leading-tight"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Premium demo frame */}
          <div className="relative mt-4 lg:mt-0">
            {/* Elegant paper-style frame */}
            <div
              className="rounded-sm overflow-hidden"
              style={{
                background: tokens.colors.paper.white,
                boxShadow: `
                  0 1px 2px rgba(0,0,0,0.04),
                  0 4px 8px rgba(0,0,0,0.04),
                  0 16px 32px rgba(0,0,0,0.06),
                  0 32px 64px rgba(0,0,0,0.06)
                `,
                border: `1px solid ${tokens.colors.ink[200]}40`,
              }}
            >
              {/* Minimal elegant header */}
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
                style={{
                  borderBottom: `1px solid ${tokens.colors.ink[100]}`,
                  background: tokens.colors.paper.cream,
                }}
              >
                {/* Title */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: isPlaying ? '#22c55e' : tokens.colors.ink[300] }}
                  />
                  <span
                    className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase"
                    style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans, fontWeight: 500 }}
                  >
                    {isPlaying ? 'Generating' : 'Content Studio'}
                  </span>
                </div>

                {/* Replay */}
                <button
                  onClick={() => {
                    if (!isPlaying) {
                      setHasStarted(false);
                      setDisplayedText('');
                      setCurrentStageIndex(0);
                      setShowBlogView(false);
                      setTimeout(() => runDemo(), 100);
                    }
                  }}
                  disabled={isPlaying}
                  className="text-[10px] sm:text-xs tracking-wide transition-opacity disabled:opacity-40 hover:opacity-70 px-2 py-1 -mr-2"
                  style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                >
                  Replay
                </button>
              </div>

              {/* Stages - responsive layout */}
              <div
                className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between sm:justify-start sm:gap-6 overflow-x-auto"
                style={{
                  borderBottom: `1px solid ${tokens.colors.ink[100]}`,
                  background: `linear-gradient(180deg, ${tokens.colors.paper.white} 0%, ${tokens.colors.paper.cream}50 100%)`,
                }}
              >
                {DEMO_STAGES.map((stage, index) => {
                  const isActive = index === currentStageIndex;
                  const isComplete = index < currentStageIndex;

                  return (
                    <div key={stage.id} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span
                        className="text-[10px] sm:text-xs transition-all duration-500"
                        style={{
                          color: isActive
                            ? tokens.colors.ink[700]
                            : isComplete
                            ? tokens.colors.sage[600]
                            : tokens.colors.ink[300],
                          fontFamily: tokens.fonts.sans,
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {isComplete ? '✓' : `${index + 1}.`}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs transition-all duration-500"
                        style={{
                          color: isActive
                            ? tokens.colors.ink[700]
                            : isComplete
                            ? tokens.colors.sage[600]
                            : tokens.colors.ink[300],
                          fontFamily: tokens.fonts.sans,
                          fontWeight: isActive ? 500 : 400,
                        }}
                      >
                        {/* Show short label on mobile, full label on larger screens */}
                        <span className="sm:hidden">{stage.shortLabel}</span>
                        <span className="hidden sm:inline">{stage.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Content area - adjusted heights for mobile */}
              <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
                {/* Generation view */}
                <div
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: showBlogView ? 0 : 1,
                    transform: showBlogView ? 'translateY(-10px)' : 'translateY(0)',
                    pointerEvents: showBlogView ? 'none' : 'auto',
                  }}
                >
                  <div className="h-full px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
                    {/* Placeholder */}
                    {!displayedText && !isPlaying && (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center px-4">
                          <p
                            className="text-base sm:text-lg mb-2 font-light"
                            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
                          >
                            Watch content come to life
                          </p>
                          <p
                            className="text-[10px] sm:text-xs"
                            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                          >
                            Style-matched generation preview
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Loading */}
                    {isPlaying && !displayedText && (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <p
                            className="content-text text-sm sm:text-base italic mb-2"
                            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
                          >
                            {DEMO_STAGES[currentStageIndex]?.label}...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Generated content with premium typography */}
                    {displayedText && (
                      <div
                        className="overflow-y-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] pr-2 sm:pr-4"
                        style={{ scrollbarWidth: 'thin' }}
                      >
                        {displayedText.split('\n\n').map((para, i) => (
                          <p
                            key={i}
                            className="content-text mb-4 sm:mb-6 last:mb-0"
                            style={{
                              fontFamily: tokens.fonts.serif,
                              fontSize: i === 0 ? '1rem' : '0.875rem',
                              lineHeight: 1.8,
                              color: i === 0 ? tokens.colors.ink[800] : tokens.colors.ink[600],
                              fontWeight: 300,
                              letterSpacing: '0.01em',
                            }}
                          >
                            {i === 0 && (
                              <span
                                className="float-left text-4xl sm:text-5xl mr-2 sm:mr-3 -mt-1"
                                style={{
                                  fontFamily: tokens.fonts.serif,
                                  color: tokens.colors.ink[700],
                                  fontWeight: 400,
                                  lineHeight: 1,
                                }}
                              >
                                {para.charAt(0)}
                              </span>
                            )}
                            {i === 0 ? para.slice(1) : para}
                          </p>
                        ))}
                        {isPlaying && (
                          <span
                            className="inline-block w-0.5 h-4 sm:h-5 ml-1"
                            style={{
                              background: tokens.colors.ink[600],
                              animation: 'blink 1s step-end infinite',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Blog preview view */}
                <div
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: showBlogView ? 1 : 0,
                    transform: showBlogView ? 'translateY(0)' : 'translateY(10px)',
                    pointerEvents: showBlogView ? 'auto' : 'none',
                  }}
                >
                  <div className="h-full px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
                    {/* Blog header */}
                    <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b" style={{ borderColor: tokens.colors.ink[100] }}>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <span
                          className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase"
                          style={{ color: tokens.colors.sage[600], fontFamily: tokens.fonts.sans, fontWeight: 500 }}
                        >
                          Business
                        </span>
                        <span style={{ color: tokens.colors.ink[200] }}>·</span>
                        <span
                          className="text-[10px] sm:text-xs"
                          style={{ color: tokens.colors.ink[400], fontFamily: tokens.fonts.sans }}
                        >
                          5 min read
                        </span>
                      </div>
                      <h2
                        className="text-xl sm:text-2xl lg:text-3xl font-light mb-4 sm:mb-5 leading-tight"
                        style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[800] }}
                      >
                        What Six Years of Sustainability{' '}
                        <em className="font-light" style={{ color: tokens.colors.ink[600] }}>Actually Taught Me</em>
                      </h2>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: tokens.colors.ink[100] }}
                        >
                          <span
                            className="text-xs sm:text-sm"
                            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[600] }}
                          >
                            JM
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-xs sm:text-sm truncate"
                            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans, fontWeight: 500 }}
                          >
                            Julia Mitchell
                          </p>
                          <p
                            className="text-[10px] sm:text-xs truncate"
                            style={{ color: tokens.colors.ink[400], fontFamily: tokens.fonts.sans }}
                          >
                            Founder, Grounded Coffee Co.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Blog excerpt */}
                    <div className="overflow-y-auto max-h-[100px] sm:max-h-[140px] lg:max-h-[180px]">
                      {blogContent.slice(0, 2).map((block, i) => (
                        <p
                          key={i}
                          className="content-text mb-4 sm:mb-5 font-light"
                          style={{
                            fontFamily: tokens.fonts.serif,
                            fontSize: '0.875rem',
                            lineHeight: 1.8,
                            color: i === 0 ? tokens.colors.ink[700] : tokens.colors.ink[500],
                            letterSpacing: '0.01em',
                          }}
                        >
                          {i === 0 && (
                            <span
                              className="float-left text-3xl sm:text-4xl mr-2 -mt-0.5"
                              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[600], fontWeight: 400, lineHeight: 1 }}
                            >
                              {block.content.charAt(0)}
                            </span>
                          )}
                          {i === 0 ? block.content.slice(1) : block.content}
                        </p>
                      ))}
                    </div>

                    {/* Success indicator - responsive positioning */}
                    <div
                      className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
                      style={{
                        background: tokens.colors.sage[50],
                        border: `1px solid ${tokens.colors.sage[200]}`,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.sage[600]} strokeWidth="2" className="flex-shrink-0">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span
                        className="text-[10px] sm:text-xs whitespace-nowrap"
                        style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans, fontWeight: 500 }}
                      >
                        Style Matched
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p
              className="text-center mt-4 sm:mt-5 text-[10px] sm:text-xs"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans, letterSpacing: '0.05em' }}
            >
              Your style · Your voice · Your content
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
