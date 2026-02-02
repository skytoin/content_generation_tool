'use client';

/**
 * SHOWCASE PAGE
 *
 * Demo page to preview all Ink Diffusion UI components and pages.
 */

import React, { useState } from 'react';
import { tokens } from './design-tokens';
import { Sidebar } from './layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { GenerationPage } from './pages/GenerationPage';
import { ContentPreviewPage } from './pages/ContentPreviewPage';
import { PricingConfiguratorPage } from './pages/PricingConfiguratorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CustomizationFlowPage } from './pages/CustomizationFlowPage';

const BLOG_STAGES = [
  { id: 'analyze', label: 'Reading your voice' },
  { id: 'research', label: 'Gathering insights' },
  { id: 'architect', label: 'Shaping the narrative' },
  { id: 'compose', label: 'Composing prose' },
  { id: 'refine', label: 'Refining every word' },
  { id: 'perfect', label: 'Final touches' },
];

const SAMPLE_TEXT = `The most compelling content doesn't announce its sophistication—it simply demonstrates it. Every word carries intention, every pause creates anticipation, every insight lands with quiet authority.

This is what separates forgettable content from work that resonates: the invisible craft behind visible impact. Your audience may not consciously notice the careful rhythm of your sentences, the strategic placement of your arguments, or the subtle callbacks that create cohesion. But they feel it.

Great content marketing isn't about volume or frequency. It's about creating moments of genuine connection.`;

const pages = [
  { id: 'dashboard', label: 'Dashboard', component: DashboardPage },
  { id: 'generation', label: 'Generation Theater' },
  { id: 'preview', label: 'Content Preview', component: ContentPreviewPage },
  { id: 'pricing', label: 'Pricing Configurator', component: PricingConfiguratorPage },
  { id: 'analytics', label: 'Analytics', component: AnalyticsPage },
  { id: 'customization', label: 'Customization Flow', component: CustomizationFlowPage },
];

export const ShowcasePage: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [streamedText, setStreamedText] = useState('');

  // Simulate generation for the Generation page
  React.useEffect(() => {
    if (activePage !== 'generation' || !isGenerating) return;

    const words = SAMPLE_TEXT.split(' ');
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 0.8, 100);
        setCurrentStage(Math.min(Math.floor((newProgress / 100) * BLOG_STAGES.length), BLOG_STAGES.length - 1));
        setStreamedText(words.slice(0, Math.floor((newProgress / 100) * words.length)).join(' '));
        if (newProgress >= 100) setIsGenerating(false);
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [activePage, isGenerating]);

  const resetGeneration = () => {
    setProgress(0);
    setCurrentStage(0);
    setStreamedText('');
    setIsGenerating(false);
  };

  React.useEffect(() => {
    resetGeneration();
    if (activePage === 'generation') {
      setTimeout(() => setIsGenerating(true), 500);
    }
  }, [activePage]);

  return (
    <div className="flex min-h-screen" style={{ background: tokens.colors.paper.cream }}>
      {/* Page selector - fixed header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(26,26,26,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">Ink Diffusion System</span>
          <span className="text-white/30 mx-2">|</span>
          <div className="flex gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm transition-all
                  ${activePage === page.id
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:bg-white/10'
                  }
                `}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {activePage === 'generation' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGenerating(!isGenerating)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                ${isGenerating ? 'bg-amber-500 text-black' : 'bg-white text-black'}
              `}
            >
              {isGenerating ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={resetGeneration}
              className="px-4 py-2 rounded-lg text-sm text-white/60 border border-white/20"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="flex-1 pt-16">
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'generation' && (
          <GenerationPage
            stages={BLOG_STAGES}
            currentStageIndex={currentStage}
            streamedText={streamedText}
            isGenerating={isGenerating}
            progress={Math.round(progress)}
          />
        )}
        {activePage === 'preview' && <ContentPreviewPage />}
        {activePage === 'pricing' && <PricingConfiguratorPage />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'customization' && <CustomizationFlowPage />}
      </div>
    </div>
  );
};

export default ShowcasePage;
