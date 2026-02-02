'use client';

/**
 * INSTAGRAM SURFACE
 *
 * Displays Instagram content in a visual carousel/post format.
 * Shows images, captions, hashtags, and slides in Instagram style.
 */

import React, { useMemo, useState } from 'react';
import { tokens } from '../primitives/design-tokens';

interface InstagramSlide {
  slideNumber: number;
  headline: string;
  subtext: string;
  visualDirection?: string;
  imageUrl?: string;
}

interface ParsedInstagramContent {
  caption: string;
  hashtags: string;
  altText: string;
  slides: InstagramSlide[];
  images: { slideNumber: number; imageUrl: string }[];
}

interface InstagramSurfaceProps {
  text: string;
  isGenerating: boolean;
  title?: string;
}

function parseInstagramContent(text: string): ParsedInstagramContent {
  const result: ParsedInstagramContent = {
    caption: '',
    hashtags: '',
    altText: '',
    slides: [],
    images: [],
  };


  // Extract caption
  const captionMatch = text.match(/📝 CAPTION:\n([\s\S]*?)(?=\n#️⃣|$)/);
  if (captionMatch) {
    result.caption = captionMatch[1].trim();
  }

  // Extract hashtags
  const hashtagMatch = text.match(/#️⃣ HASHTAGS:\n([\s\S]*?)(?=\n🔍|$)/);
  if (hashtagMatch) {
    result.hashtags = hashtagMatch[1].trim();
  }

  // Extract alt text
  const altTextMatch = text.match(/🔍 ALT TEXT:\n([\s\S]*?)(?=\n📑|$)/);
  if (altTextMatch) {
    result.altText = altTextMatch[1].trim();
  }

  // Extract slides using a more robust approach
  const slidesSection = text.match(/📑 CAROUSEL SLIDES:\n([\s\S]*?)(?=\n<!--|$)/);

  if (slidesSection) {
    // Match each slide block individually - use [\s\S] to match any char including hyphens
    const slideRegex = /--- Slide (\d+) ---\s*\n([\s\S]*?)(?=\n--- Slide |\n<!--|$)/g;
    let slideMatch;
    while ((slideMatch = slideRegex.exec(slidesSection[1])) !== null) {
      const slideNum = parseInt(slideMatch[1]);
      const slideContent = slideMatch[2];

      const headlineMatch = slideContent.match(/Headline:\s*(.*?)(?:\n|$)/);
      const subtextMatch = slideContent.match(/Subtext:\s*(.*?)(?:\n|$)/);
      const visualMatch = slideContent.match(/Visual:\s*(.*?)(?:\n|$)/);

      result.slides.push({
        slideNumber: slideNum,
        headline: headlineMatch?.[1]?.trim() || '',
        subtext: subtextMatch?.[1]?.trim() || '',
        visualDirection: visualMatch?.[1]?.trim(),
      });
    }
  }

  // Extract image URLs from hidden data
  const imageDataMatch = text.match(/<!-- IMAGE_DATA\n([\s\S]*?)-->/);
  if (imageDataMatch) {
    const imageLines = imageDataMatch[1].split('\n').filter(Boolean);
    imageLines.forEach(line => {
      const imgMatch = line.match(/Slide (\d+): (https?:\/\/\S+)/);
      if (imgMatch) {
        result.images.push({
          slideNumber: parseInt(imgMatch[1]),
          imageUrl: imgMatch[2],
        });
      }
    });
  }

  // Map images to slides
  result.slides = result.slides.map(slide => {
    const image = result.images.find(img => img.slideNumber === slide.slideNumber);
    return { ...slide, imageUrl: image?.imageUrl };
  });

  return result;
}

export const InstagramSurface: React.FC<InstagramSurfaceProps> = ({
  text,
  isGenerating,
  title = 'Instagram Content',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const parsed = useMemo(() => parseInstagramContent(text), [text]);
  const hasSlides = parsed.slides.length > 0;
  const hasImages = parsed.images.length > 0;

  return (
    <div className="relative">
      {/* Outer frame */}
      <div
        className="absolute -inset-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.paper.dark} 0%, ${tokens.colors.paper.border} 100%)`,
          padding: '1px',
        }}
      >
        <div
          className="w-full h-full rounded-2xl"
          style={{ background: tokens.colors.paper.cream }}
        />
      </div>

      {/* Main surface */}
      <div
        className="relative min-h-[500px] p-8 rounded-xl overflow-hidden"
        style={{
          background: tokens.colors.paper.white,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 25px 50px -12px rgba(26, 26, 26, 0.15),
            0 0 0 1px ${tokens.colors.paper.border}
          `,
        }}
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b" style={{ borderColor: tokens.colors.paper.border }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)` }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
              >
                {title}
              </p>
              <p
                className="text-xs"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {isGenerating ? 'Creating your post...' : 'Instagram Post Preview'}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel/Image Display */}
        {hasSlides && (
          <div className="mb-6">
            {/* Image carousel */}
            <div
              className="relative aspect-square rounded-lg overflow-hidden mb-3"
              style={{ background: tokens.colors.paper.warm }}
            >
              {parsed.slides[currentSlide]?.imageUrl ? (
                <img
                  src={parsed.slides[currentSlide].imageUrl}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: tokens.colors.ink[50] }}
                  >
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <p
                    className="text-lg font-medium mb-2"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    {parsed.slides[currentSlide]?.headline || 'Slide ' + (currentSlide + 1)}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {parsed.slides[currentSlide]?.subtext}
                  </p>
                  {parsed.slides[currentSlide]?.visualDirection && (
                    <p
                      className="text-xs mt-3 px-3 py-1 rounded-full"
                      style={{
                        background: tokens.colors.sage[50],
                        color: tokens.colors.sage[700],
                        fontFamily: tokens.fonts.sans
                      }}
                    >
                      Visual: {parsed.slides[currentSlide].visualDirection}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation arrows */}
              {parsed.slides.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => Math.min(parsed.slides.length - 1, prev + 1))}
                    disabled={currentSlide === parsed.slides.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Dots indicator */}
            {parsed.slides.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {parsed.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: idx === currentSlide ? tokens.colors.ink[700] : tokens.colors.paper.border,
                      transform: idx === currentSlide ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Standalone images (if no slides but images exist) */}
        {!hasSlides && hasImages && (
          <div className="mb-6 grid grid-cols-2 gap-2">
            {parsed.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Caption */}
        {parsed.caption && (
          <div className="mb-4">
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
            >
              {parsed.caption}
            </p>
          </div>
        )}

        {/* Hashtags */}
        {parsed.hashtags && (
          <div className="mb-4">
            <p
              className="text-sm"
              style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}
            >
              {parsed.hashtags}
            </p>
          </div>
        )}

        {/* Alt Text */}
        {parsed.altText && (
          <div
            className="mt-4 p-3 rounded-lg"
            style={{ background: tokens.colors.paper.warm }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Alt Text (for accessibility)
            </p>
            <p
              className="text-sm"
              style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
            >
              {parsed.altText}
            </p>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{ background: tokens.colors.ink[50] }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: tokens.colors.ink[500] }}
            />
            <span
              className="text-xs"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              Creating...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramSurface;
