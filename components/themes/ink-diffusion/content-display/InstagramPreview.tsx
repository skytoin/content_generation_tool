'use client';

/**
 * INSTAGRAM PREVIEW
 *
 * Shows Instagram content in a realistic phone mockup.
 * Carousel with swipe, caption, hashtags in authentic Instagram style.
 */

import React, { useState, useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';

interface InstagramSlide {
  slideNumber: number;
  headline?: string;
  subtext?: string;
  visualDirection?: string;
  imageUrl?: string;
}

interface InstagramPreviewProps {
  content: string;
  images: { slideNumber: number; url: string }[];
  companyName?: string;
}

// Parse Instagram content format
function parseInstagramContent(text: string) {
  const result = {
    caption: '',
    hashtags: '',
    altText: '',
    slides: [] as InstagramSlide[],
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

  // Extract slides
  const slidesSection = text.match(/📑 CAROUSEL SLIDES:\n([\s\S]*?)(?=\n<!--|$)/);
  if (slidesSection) {
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

  return result;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  content,
  images,
  companyName = 'your_brand',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const parsed = useMemo(() => parseInstagramContent(content), [content]);

  // Map images to slides
  const slidesWithImages = useMemo(() => {
    return parsed.slides.map(slide => {
      const image = images.find(img => img.slideNumber === slide.slideNumber);
      return { ...slide, imageUrl: image?.url };
    });
  }, [parsed.slides, images]);

  const totalSlides = slidesWithImages.length || 1;
  const username = companyName.toLowerCase().replace(/\s+/g, '_');

  // Truncate caption for display
  const displayCaption = parsed.caption.length > 125
    ? parsed.caption.slice(0, 125) + '...'
    : parsed.caption;

  const [showFullCaption, setShowFullCaption] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame - scales down on mobile */}
      <div
        className="relative rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 transform scale-[0.85] sm:scale-100 origin-top"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          boxShadow: `
            0 50px 100px -20px rgba(0,0,0,0.5),
            0 30px 60px -30px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-7 rounded-full z-20"
          style={{ background: '#000' }}
        />

        {/* Screen */}
        <div
          className="relative w-[320px] sm:w-[375px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
          style={{ background: '#fff' }}
        >
          {/* Instagram Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: '#dbdbdb' }}
          >
            <div className="flex items-center gap-3">
              {/* Profile pic */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
                  color: '#fff',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#262626' }}>
                  {username}
                </p>
              </div>
            </div>
            {/* More button */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#262626">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </div>

          {/* Image/Carousel Area */}
          <div className="relative aspect-square bg-gray-100">
            {slidesWithImages[currentSlide]?.imageUrl ? (
              <img
                src={slidesWithImages[currentSlide].imageUrl}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Placeholder slide with content */
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                style={{ background: '#fafafa' }}
              >
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: '#262626' }}
                >
                  {slidesWithImages[currentSlide]?.headline || `Slide ${currentSlide + 1}`}
                </h3>
                <p
                  className="text-base"
                  style={{ color: '#8e8e8e' }}
                >
                  {slidesWithImages[currentSlide]?.subtext || ''}
                </p>
              </div>
            )}

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                {currentSlide > 0 && (
                  <button
                    onClick={() => setCurrentSlide(prev => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#262626">
                      <path d="M15 18l-6-6 6-6" stroke="#262626" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                )}
                {currentSlide < totalSlides - 1 && (
                  <button
                    onClick={() => setCurrentSlide(prev => prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#262626">
                      <path d="M9 18l6-6-6-6" stroke="#262626" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* Slide counter */}
            {totalSlides > 1 && (
              <div
                className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}
              >
                {currentSlide + 1}/{totalSlides}
              </div>
            )}
          </div>

          {/* Carousel Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-1 py-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    background: idx === currentSlide ? '#0095f6' : '#a8a8a8',
                  }}
                />
              ))}
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Like */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {/* Comment */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {/* Share */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            {/* Save */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Likes */}
          <div className="px-4 pb-1">
            <p className="text-sm font-semibold" style={{ color: '#262626' }}>
              1,234 likes
            </p>
          </div>

          {/* Caption */}
          <div className="px-4 pb-3">
            <p className="text-sm" style={{ color: '#262626' }}>
              <span className="font-semibold">{username}</span>{' '}
              {showFullCaption ? parsed.caption : displayCaption}
              {parsed.caption.length > 125 && !showFullCaption && (
                <button
                  onClick={() => setShowFullCaption(true)}
                  className="text-gray-400 ml-1"
                >
                  more
                </button>
              )}
            </p>
          </div>

          {/* Hashtags */}
          {parsed.hashtags && (
            <div className="px-4 pb-3">
              <p className="text-sm" style={{ color: '#00376b' }}>
                {parsed.hashtags}
              </p>
            </div>
          )}

          {/* Time */}
          <div className="px-4 pb-4">
            <p className="text-xs uppercase" style={{ color: '#8e8e8e' }}>
              Just now
            </p>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 rounded-full" style={{ background: '#000' }} />
          </div>
        </div>
      </div>

      {/* Slide thumbnails (outside phone) */}
      {totalSlides > 1 && (
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 max-w-[400px]">
          {slidesWithImages.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all"
              style={{
                border: idx === currentSlide
                  ? `2px solid ${tokens.colors.ink[700]}`
                  : `1px solid ${tokens.colors.paper.border}`,
                opacity: idx === currentSlide ? 1 : 0.6,
              }}
            >
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs font-medium"
                  style={{ background: tokens.colors.paper.warm, color: tokens.colors.text.muted }}
                >
                  {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstagramPreview;
