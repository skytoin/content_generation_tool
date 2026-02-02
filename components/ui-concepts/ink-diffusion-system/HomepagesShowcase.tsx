'use client';

import React, { useState } from 'react';
import { Homepage1 } from './homepages/Homepage1-EditorialLuxury';
import { Homepage2 } from './homepages/Homepage2-BoldContrast';
import { Homepage3 } from './homepages/Homepage3-ImmersiveScroll';
import { Homepage4 } from './homepages/Homepage4-GlassMorphism';
import { Homepage5 } from './homepages/Homepage5-NeoBrutalism';
import { Homepage6 } from './homepages/Homepage6-DarkElegance';
import { Homepage7 } from './homepages/Homepage7-OrganicWarm';
import { homepageVariants } from './homepages';

const components: Record<string, React.FC> = {
  Homepage1,
  Homepage2,
  Homepage3,
  Homepage4,
  Homepage5,
  Homepage6,
  Homepage7,
};

export const HomepagesShowcase: React.FC = () => {
  const [activeHomepage, setActiveHomepage] = useState('Homepage1');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const ActiveComponent = components[activeHomepage];
  const activeVariant = homepageVariants.find(v => v.component === activeHomepage);

  if (isFullscreen) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/80 text-white rounded-lg hover:bg-black transition-colors backdrop-blur-sm"
        >
          Exit Fullscreen
        </button>
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Ink Diffusion Homepage Collection
              </h1>
              <p className="text-slate-400">
                7 premium homepage designs for Scribengine
              </p>
            </div>
            <a
              href="/demo/ink-diffusion-system"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              ← Back to Design System
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-4">
            {homepageVariants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => setActiveHomepage(variant.component)}
                className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeHomepage === variant.component
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="opacity-50 mr-2">{index + 1}.</span>
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              {activeVariant?.name}
            </h2>
            <p className="text-slate-400">{activeVariant?.description}</p>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            View Fullscreen
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ height: '800px' }}
        >
          <div className="w-full h-full overflow-auto bg-white">
            <ActiveComponent />
          </div>
        </div>
      </div>

      {/* Quick Grid Preview */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <h3 className="text-lg font-medium text-white mb-6">All Variants</h3>
        <div className="grid grid-cols-7 gap-3">
          {homepageVariants.map((variant, index) => (
            <button
              key={variant.id}
              onClick={() => setActiveHomepage(variant.component)}
              className={`aspect-[3/4] rounded-lg border-2 transition-all overflow-hidden ${
                activeHomepage === variant.component
                  ? 'border-white scale-105 shadow-xl'
                  : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                <span className="text-2xl font-bold text-white/30">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepagesShowcase;
