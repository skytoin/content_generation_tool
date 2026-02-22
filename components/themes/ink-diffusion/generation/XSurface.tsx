'use client';

/**
 * X SURFACE
 *
 * Displays X/Twitter content in an authentic X post format.
 * Shows tweets, threads, and quote tweets in Twitter/X style.
 */

import React, { useMemo, useState } from 'react';
import { tokens } from '../primitives/design-tokens';

interface ParsedTweet {
  id: number;
  text: string;
  characterCount: number;
  contentType?: string;
}

interface ParsedThread {
  position: number;
  text: string;
  characterCount: number;
  purpose?: string;
}

interface ParsedQuoteTweet {
  id: number;
  targetContext: string;
  responseText: string;
  characterCount: number;
  quoteType?: string;
}

interface QualityReport {
  overallScore?: number;
  hookScore?: number;
  flowScore?: number;
  authenticityScore?: number;
  valueAddScore?: number;
  shadowbanRisk?: string;
}

interface ParsedXContent {
  contentType: 'tweets' | 'thread' | 'quote-tweets' | 'unknown';
  tweets: ParsedTweet[];
  thread: ParsedThread[];
  quoteTweets: ParsedQuoteTweet[];
  hookVariations: string[];
  qualityReport: QualityReport;
}

interface XSurfaceProps {
  text: string;
  isGenerating: boolean;
  title?: string;
}

function parseXContent(text: string): ParsedXContent {
  const result: ParsedXContent = {
    contentType: 'unknown',
    tweets: [],
    thread: [],
    quoteTweets: [],
    hookVariations: [],
    qualityReport: {},
  };

  // Detect content type
  if (text.includes('🐦 X TWEET PACK')) {
    result.contentType = 'tweets';

    // Parse individual tweets
    const tweetRegex = /--- Tweet (\d+) ---\s*\n([\s\S]*?)(?=\n--- Tweet |\n\n📊|$)/g;
    let match;
    while ((match = tweetRegex.exec(text)) !== null) {
      const tweetNum = parseInt(match[1]);
      const content = match[2];

      // Extract the main text (before the metadata line)
      const lines = content.trim().split('\n');
      const metaLine = lines.find(l => l.startsWith('['));
      const textLines = lines.filter(l => !l.startsWith('['));
      const tweetText = textLines.join('\n').trim();

      // Parse metadata
      const metaMatch = metaLine?.match(/\[(\d+) chars \| (\w+)\]/);

      result.tweets.push({
        id: tweetNum,
        text: tweetText,
        characterCount: metaMatch ? parseInt(metaMatch[1]) : tweetText.length,
        contentType: metaMatch?.[2] || 'insight',
      });
    }
  } else if (text.includes('🧵 X THREAD')) {
    result.contentType = 'thread';

    // Parse thread tweets
    const threadRegex = /--- (\d+)\/\d+ ---\s*\n([\s\S]*?)(?=\n--- \d+\/|\n\n🎣|\n\n📊|$)/g;
    let match;
    while ((match = threadRegex.exec(text)) !== null) {
      const position = parseInt(match[1]);
      const content = match[2];

      const lines = content.trim().split('\n');
      const metaLine = lines.find(l => l.startsWith('['));
      const textLines = lines.filter(l => !l.startsWith('['));
      const tweetText = textLines.join('\n').trim();

      const metaMatch = metaLine?.match(/\[(\d+) chars \| ([\w\s]+)\]/);

      result.thread.push({
        position,
        text: tweetText,
        characterCount: metaMatch ? parseInt(metaMatch[1]) : tweetText.length,
        purpose: metaMatch?.[2] || 'content',
      });
    }

    // Parse hook variations
    const hooksMatch = text.match(/🎣 HOOK VARIATIONS\n([\s\S]*?)(?=\n\n📊|$)/);
    if (hooksMatch) {
      const hookLines = hooksMatch[1].trim().split('\n');
      hookLines.forEach(line => {
        const hookText = line.replace(/^\d+\.\s*/, '').trim();
        if (hookText) {
          result.hookVariations.push(hookText);
        }
      });
    }
  } else if (text.includes('💬 X QUOTE TWEETS')) {
    result.contentType = 'quote-tweets';

    // Parse quote tweets
    const quoteRegex = /--- Quote (\d+) ---\s*\n([\s\S]*?)(?=\n--- Quote |\n\n📊|$)/g;
    let match;
    while ((match = quoteRegex.exec(text)) !== null) {
      const quoteNum = parseInt(match[1]);
      const content = match[2];

      const targetMatch = content.match(/Target:\s*(.*)/);
      const responseMatch = content.match(/Response:\s*(.*)/);
      const metaMatch = content.match(/\[(\d+) chars \| (\w+)\]/);

      result.quoteTweets.push({
        id: quoteNum,
        targetContext: targetMatch?.[1]?.trim() || '',
        responseText: responseMatch?.[1]?.trim() || '',
        characterCount: metaMatch ? parseInt(metaMatch[1]) : 0,
        quoteType: metaMatch?.[2] || 'add_value',
      });
    }
  }

  // Parse quality report
  const reportMatch = text.match(/📊 QUALITY REPORT\n([\s\S]*?)$/);
  if (reportMatch) {
    const reportContent = reportMatch[1];

    const scoreMatch = reportContent.match(/(?:Score|Overall):\s*(\d+)\/10/);
    const hookMatch = reportContent.match(/Hook:\s*(\d+)\/10/);
    const flowMatch = reportContent.match(/Flow:\s*(\d+)\/10/);
    const authMatch = reportContent.match(/Authenticity:\s*(\d+)\/10/);
    const valueMatch = reportContent.match(/Value Add:\s*(\d+)\/10/);
    const riskMatch = reportContent.match(/Shadowban Risk:\s*(\w+)/);

    result.qualityReport = {
      overallScore: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
      hookScore: hookMatch ? parseInt(hookMatch[1]) : undefined,
      flowScore: flowMatch ? parseInt(flowMatch[1]) : undefined,
      authenticityScore: authMatch ? parseInt(authMatch[1]) : undefined,
      valueAddScore: valueMatch ? parseInt(valueMatch[1]) : undefined,
      shadowbanRisk: riskMatch?.[1],
    };
  }

  return result;
}

// X Logo component
const XLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Single Tweet Card
const TweetCard: React.FC<{
  text: string;
  characterCount: number;
  contentType?: string;
  isThread?: boolean;
  position?: number;
  totalInThread?: number;
  purpose?: string;
}> = ({ text, characterCount, contentType, isThread, position, totalInThread, purpose }) => (
  <div
    className="relative p-4 rounded-xl transition-all hover:bg-opacity-50"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    {/* Thread connector line */}
    {isThread && position && position < (totalInThread || 0) && (
      <div
        className="absolute left-[26px] top-[56px] bottom-[-16px] w-[2px]"
        style={{ background: tokens.colors.paper.border }}
      />
    )}

    {/* User info row */}
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: tokens.colors.ink[100] }}
      >
        <span className="text-sm font-bold" style={{ color: tokens.colors.ink[700] }}>Y</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Username row */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
            Your Brand
          </span>
          <svg width="16" height="16" viewBox="0 0 22 22" fill="#1D9BF0">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
          <span className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
            @yourbrand
          </span>
          {isThread && position && (
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[600] }}>
              {position}/{totalInThread}
            </span>
          )}
        </div>

        {/* Tweet text */}
        <p
          className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap"
          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
        >
          {text}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}>
            {characterCount}/280 chars
          </span>
          {contentType && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}
            >
              {contentType}
            </span>
          )}
          {purpose && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[600] }}
            >
              {purpose}
            </span>
          )}
        </div>

        {/* Action buttons (visual only) */}
        <div className="flex items-center gap-8 mt-3 pt-2">
          {[
            { icon: 'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z', count: '' },
            { icon: 'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z', count: '' },
            { icon: 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z', count: '' },
            { icon: 'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z', count: '' },
          ].map((action, idx) => (
            <button key={idx} className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: tokens.colors.text.muted }}>
                <path d={action.icon} fill="currentColor" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Quote Tweet Card
const QuoteTweetCard: React.FC<{
  targetContext: string;
  responseText: string;
  characterCount: number;
  quoteType?: string;
}> = ({ targetContext, responseText, characterCount, quoteType }) => (
  <div
    className="p-4 rounded-xl"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    {/* Target context */}
    <div
      className="mb-3 p-3 rounded-lg"
      style={{ background: tokens.colors.paper.warm, border: `1px dashed ${tokens.colors.paper.border}` }}
    >
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>
        When responding to:
      </p>
      <p className="text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
        {targetContext}
      </p>
    </div>

    {/* Your response */}
    <div className="flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: tokens.colors.ink[100] }}
      >
        <span className="text-sm font-bold" style={{ color: tokens.colors.ink[700] }}>Y</span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          <span className="font-bold text-sm" style={{ color: tokens.colors.text.primary }}>Your Brand</span>
          <svg width="16" height="16" viewBox="0 0 22 22" fill="#1D9BF0">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
        </div>

        <p
          className="text-[15px] leading-relaxed"
          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
        >
          {responseText}
        </p>

        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}>
            {characterCount}/280 chars
          </span>
          {quoteType && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}
            >
              {quoteType.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const XSurface: React.FC<XSurfaceProps> = ({
  text,
  isGenerating,
  title = 'X Content',
}) => {
  const [selectedTweet, setSelectedTweet] = useState(0);
  const parsed = useMemo(() => parseXContent(text), [text]);

  const getContentTitle = () => {
    switch (parsed.contentType) {
      case 'tweets': return 'Tweet Pack';
      case 'thread': return 'Thread';
      case 'quote-tweets': return 'Quote Tweets';
      default: return 'X Content';
    }
  };

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
        className="relative min-h-[500px] p-6 rounded-xl overflow-hidden"
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
              style={{ background: tokens.colors.ink[900] }}
            >
              <XLogo />
              <style>{`.XLogo { color: white; }`}</style>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
              >
                {title || getContentTitle()}
              </p>
              <p
                className="text-xs"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {isGenerating ? 'Creating your content...' : `X ${getContentTitle()} Preview`}
              </p>
            </div>

            {/* Content count */}
            <div className="ml-auto">
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
              >
                {parsed.contentType === 'tweets' && `${parsed.tweets.length} tweets`}
                {parsed.contentType === 'thread' && `${parsed.thread.length} in thread`}
                {parsed.contentType === 'quote-tweets' && `${parsed.quoteTweets.length} quotes`}
              </span>
            </div>
          </div>
        </div>

        {/* Tweet Pack */}
        {parsed.contentType === 'tweets' && parsed.tweets.length > 0 && (
          <div className="space-y-4">
            {parsed.tweets.map((tweet, idx) => (
              <TweetCard
                key={tweet.id}
                text={tweet.text}
                characterCount={tweet.characterCount}
                contentType={tweet.contentType}
              />
            ))}
          </div>
        )}

        {/* Thread */}
        {parsed.contentType === 'thread' && parsed.thread.length > 0 && (
          <div className="space-y-4">
            {parsed.thread.map((tweet, idx) => (
              <TweetCard
                key={tweet.position}
                text={tweet.text}
                characterCount={tweet.characterCount}
                purpose={tweet.purpose}
                isThread={true}
                position={tweet.position}
                totalInThread={parsed.thread.length}
              />
            ))}

            {/* Hook variations */}
            {parsed.hookVariations.length > 0 && (
              <div
                className="mt-6 p-4 rounded-xl"
                style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[100]}` }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: tokens.colors.sage[700] }}>
                  🎣 Alternative Hooks
                </p>
                <div className="space-y-2">
                  {parsed.hookVariations.map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg text-sm"
                      style={{ background: tokens.colors.paper.white, color: tokens.colors.text.primary }}
                    >
                      {hook}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quote Tweets */}
        {parsed.contentType === 'quote-tweets' && parsed.quoteTweets.length > 0 && (
          <div className="space-y-4">
            {parsed.quoteTweets.map((qt) => (
              <QuoteTweetCard
                key={qt.id}
                targetContext={qt.targetContext}
                responseText={qt.responseText}
                characterCount={qt.characterCount}
                quoteType={qt.quoteType}
              />
            ))}
          </div>
        )}

        {/* Quality Report */}
        {parsed.qualityReport.overallScore !== undefined && (
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ background: tokens.colors.paper.warm }}
          >
            <p className="text-sm font-medium mb-3" style={{ color: tokens.colors.text.primary }}>
              📊 Quality Report
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {parsed.qualityReport.overallScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Overall</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.ink[700] }}>
                    {parsed.qualityReport.overallScore}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.hookScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Hook</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.sage[600] }}>
                    {parsed.qualityReport.hookScore}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.authenticityScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Authenticity</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.sage[600] }}>
                    {parsed.qualityReport.authenticityScore}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.shadowbanRisk && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Shadowban Risk</p>
                  <p
                    className="text-lg font-bold capitalize"
                    style={{
                      color: parsed.qualityReport.shadowbanRisk === 'low'
                        ? tokens.colors.sage[600]
                        : parsed.qualityReport.shadowbanRisk === 'medium'
                        ? '#f59e0b'
                        : '#ef4444'
                    }}
                  >
                    {parsed.qualityReport.shadowbanRisk}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{ background: tokens.colors.ink[900] }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#fff' }}
            />
            <span
              className="text-xs"
              style={{ color: '#fff', fontFamily: tokens.fonts.sans }}
            >
              Creating...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default XSurface;
