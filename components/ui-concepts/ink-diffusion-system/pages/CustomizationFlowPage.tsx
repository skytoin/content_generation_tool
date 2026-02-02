'use client';

/**
 * CUSTOMIZATION FLOW PAGE
 *
 * Stepped, conversational flow for content customization.
 * Visual selectors, progressive disclosure, premium feel.
 */

import React, { useState } from 'react';
import { tokens } from '../design-tokens';
import { InkButton } from '../primitives/InkButton';
import { InkCard } from '../primitives/InkCard';
import { InkProgress } from '../primitives/InkProgress';

// Tone options as visual spectrum
const toneOptions = [
  { id: 'formal', label: 'Formal', description: 'Professional, authoritative', position: 0 },
  { id: 'balanced', label: 'Balanced', description: 'Professional yet approachable', position: 33 },
  { id: 'conversational', label: 'Conversational', description: 'Friendly, relatable', position: 66 },
  { id: 'casual', label: 'Casual', description: 'Informal, playful', position: 100 },
];

// Audience persona cards
const audiencePersonas = [
  {
    id: 'beginners',
    title: 'Beginners',
    description: 'New to the topic, needs foundational context',
    icon: '🌱',
    color: tokens.colors.sage[100],
  },
  {
    id: 'practitioners',
    title: 'Practitioners',
    description: 'Working knowledge, wants practical insights',
    icon: '⚡',
    color: tokens.colors.ink[100],
  },
  {
    id: 'experts',
    title: 'Experts',
    description: 'Deep expertise, seeks advanced perspectives',
    icon: '🎯',
    color: tokens.colors.paper.warm,
  },
  {
    id: 'executives',
    title: 'Executives',
    description: 'Decision-makers, values strategic overview',
    icon: '📊',
    color: '#FDF8F0',
  },
];

// Content purpose options
const purposeOptions = [
  { id: 'educate', label: 'Educate', icon: '📚' },
  { id: 'inspire', label: 'Inspire', icon: '✨' },
  { id: 'persuade', label: 'Persuade', icon: '🎯' },
  { id: 'entertain', label: 'Entertain', icon: '🎭' },
];

const steps = [
  { id: 'audience', label: 'Audience' },
  { id: 'tone', label: 'Tone' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'details', label: 'Details' },
];

export const CustomizationFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    audience: '',
    tone: 'balanced',
    purpose: '',
    topic: '',
    keywords: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSelection = (key: string, value: string) => {
    setSelections({ ...selections, [key]: value });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Content Configuration
          </p>
          <h1
            className="text-4xl font-light mb-4"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            Tell us about your content
          </h1>
          <p
            className="text-lg"
            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
          >
            A few questions to craft the perfect piece
          </p>
        </header>

        {/* Progress */}
        <div className="mb-12">
          <InkProgress
            value={(currentStep / (steps.length - 1)) * 100}
            variant="steps"
            steps={steps.map(s => s.label)}
            currentStep={currentStep}
          />
        </div>

        {/* Step content */}
        <InkCard variant="elevated" padding="xl">
          {/* Step 1: Audience */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-2"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                >
                  Who are you writing for?
                </h2>
                <p
                  className="text-sm"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Select the persona that best matches your target reader
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {audiencePersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => updateSelection('audience', persona.id)}
                    className="text-left p-6 rounded-xl transition-all"
                    style={{
                      background: selections.audience === persona.id ? tokens.colors.paper.white : persona.color,
                      border: `2px solid ${selections.audience === persona.id ? tokens.colors.ink[700] : 'transparent'}`,
                      boxShadow: selections.audience === persona.id ? tokens.shadows.lg : 'none',
                    }}
                  >
                    <span className="text-3xl mb-3 block">{persona.icon}</span>
                    <h3
                      className="font-medium mb-1"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {persona.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                    >
                      {persona.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Tone */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-2"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                >
                  What's your tone?
                </h2>
                <p
                  className="text-sm"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Slide to find the right voice for your content
                </p>
              </div>

              {/* Tone spectrum slider */}
              <div className="relative py-8">
                {/* Track */}
                <div
                  className="h-2 rounded-full relative"
                  style={{ background: `linear-gradient(90deg, ${tokens.colors.ink[200]}, ${tokens.colors.sage[200]})` }}
                >
                  {/* Labels */}
                  <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs">
                    <span style={{ color: tokens.colors.text.muted }}>Formal</span>
                    <span style={{ color: tokens.colors.text.muted }}>Casual</span>
                  </div>
                </div>

                {/* Tone options */}
                <div className="flex justify-between mt-4">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => updateSelection('tone', tone.id)}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-6 h-6 rounded-full border-4 transition-all mb-2"
                        style={{
                          borderColor: selections.tone === tone.id ? tokens.colors.ink[700] : tokens.colors.paper.border,
                          background: selections.tone === tone.id ? tokens.colors.ink[700] : tokens.colors.paper.white,
                          boxShadow: selections.tone === tone.id ? tokens.shadows.ink : 'none',
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: selections.tone === tone.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {tone.label}
                      </span>
                      <span
                        className="text-xs mt-1"
                        style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                      >
                        {tone.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected tone preview */}
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: tokens.colors.paper.warm }}
              >
                <p
                  className="text-sm mb-2"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Sample text in {selections.tone} tone:
                </p>
                <p
                  className="text-lg"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                >
                  {selections.tone === 'formal' && '"The data demonstrates a clear correlation between strategic patience and long-term value creation."'}
                  {selections.tone === 'balanced' && '"What the data shows is compelling—strategic patience consistently leads to better outcomes."'}
                  {selections.tone === 'conversational' && '"Here\'s the thing about patience in strategy—the numbers prove it works."'}
                  {selections.tone === 'casual' && '"So get this: being patient with your strategy? Totally pays off. The data\'s pretty clear."'}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Purpose */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-2"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                >
                  What's the primary goal?
                </h2>
                <p
                  className="text-sm"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  This shapes how we structure your content
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {purposeOptions.map((purpose) => (
                  <button
                    key={purpose.id}
                    onClick={() => updateSelection('purpose', purpose.id)}
                    className="p-6 rounded-xl text-center transition-all"
                    style={{
                      background: selections.purpose === purpose.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                      border: `2px solid ${selections.purpose === purpose.id ? tokens.colors.ink[700] : 'transparent'}`,
                      boxShadow: selections.purpose === purpose.id ? tokens.shadows.lg : 'none',
                    }}
                  >
                    <span className="text-4xl mb-4 block">{purpose.icon}</span>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {purpose.label}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-2"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                >
                  Final details
                </h2>
                <p
                  className="text-sm"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Tell us what you want to write about
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                  >
                    Topic or title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., The future of remote work"
                    value={selections.topic}
                    onChange={(e) => updateSelection('topic', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: tokens.colors.paper.warm,
                      border: `1px solid ${tokens.colors.paper.border}`,
                      fontFamily: tokens.fonts.sans,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                  >
                    Key points to cover (optional)
                  </label>
                  <textarea
                    placeholder="Any specific angles, statistics, or examples you want included..."
                    value={selections.keywords}
                    onChange={(e) => updateSelection('keywords', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                    style={{
                      background: tokens.colors.paper.warm,
                      border: `1px solid ${tokens.colors.paper.border}`,
                      fontFamily: tokens.fonts.sans,
                    }}
                  />
                </div>

                {/* Advanced options toggle */}
                <button
                  className="text-sm flex items-center gap-2 transition-all hover:gap-3"
                  style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4" />
                  </svg>
                  Advanced style options
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-sm flex items-center gap-2 transition-all disabled:opacity-30"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <InkButton
                variant="primary"
                onClick={handleNext}
                disabled={currentStep === 0 && !selections.audience}
              >
                Continue
              </InkButton>
            ) : (
              <InkButton variant="primary">
                Generate Content
              </InkButton>
            )}
          </div>
        </InkCard>
      </div>
    </div>
  );
};

export default CustomizationFlowPage;
