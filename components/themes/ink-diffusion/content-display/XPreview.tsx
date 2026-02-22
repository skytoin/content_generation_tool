'use client';

/**
 * X PREVIEW
 *
 * Shows X/Twitter content in a realistic phone mockup.
 * Displays tweets, threads, and quote tweets in authentic X style.
 */

import React, { useState, useMemo } from 'react';
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

interface XPreviewProps {
  content: string;
  companyName?: string;
}

// Parse X content format
function parseXContent(text: string) {
  const result = {
    contentType: 'unknown' as 'tweets' | 'thread' | 'quote-tweets' | 'unknown',
    tweets: [] as ParsedTweet[],
    thread: [] as ParsedThread[],
    quoteTweets: [] as ParsedQuoteTweet[],
    hookVariations: [] as string[],
  };

  if (text.includes('🐦 X TWEET PACK')) {
    result.contentType = 'tweets';

    const tweetRegex = /--- Tweet (\d+) ---\s*\n([\s\S]*?)(?=\n--- Tweet |\n\n📊|$)/g;
    let match;
    while ((match = tweetRegex.exec(text)) !== null) {
      const tweetNum = parseInt(match[1]);
      const content = match[2];

      const lines = content.trim().split('\n');
      const metaLine = lines.find(l => l.startsWith('['));
      const textLines = lines.filter(l => !l.startsWith('['));
      const tweetText = textLines.join('\n').trim();

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

  return result;
}

// X Logo
const XLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Single Tweet in X style
const XTweetDisplay: React.FC<{
  text: string;
  username: string;
  displayName: string;
  isThread?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ text, username, displayName, isThread, isFirst, isLast }) => (
  <div className="relative">
    {/* Thread line */}
    {isThread && !isLast && (
      <div
        className="absolute left-[24px] top-[48px] bottom-0 w-[2px]"
        style={{ background: '#cfd9de' }}
      />
    )}

    <div className={`flex gap-3 ${isThread && !isFirst ? 'pt-0' : ''}`}>
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{ background: '#1d9bf0' }}
      >
        {displayName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* User info */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-[15px]" style={{ color: '#0f1419' }}>
            {displayName}
          </span>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="#1d9bf0">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
          <span className="text-[15px]" style={{ color: '#536471' }}>
            @{username} · 1m
          </span>
        </div>

        {/* Tweet text */}
        <p
          className="text-[15px] leading-5 mt-1 whitespace-pre-wrap"
          style={{ color: '#0f1419' }}
        >
          {text}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 max-w-[425px]">
          {[
            { icon: 'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z', label: '' },
            { icon: 'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z', label: '' },
            { icon: 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z', label: '' },
            { icon: 'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z', label: '' },
            { icon: 'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.001 3.999c0 1.11-.9 2-2 2h-14c-1.1 0-2-.9-2-2V15h2v4h14v-4h2z', label: '' },
          ].map((action, idx) => (
            <button
              key={idx}
              className="flex items-center gap-1 p-2 -ml-2 rounded-full hover:bg-blue-50 transition-colors"
              style={{ color: '#536471' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={action.icon} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Quote Tweet Display
const QuoteTweetDisplay: React.FC<{
  targetContext: string;
  responseText: string;
  username: string;
  displayName: string;
}> = ({ targetContext, responseText, username, displayName }) => (
  <div>
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{ background: '#1d9bf0' }}
      >
        {displayName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* User info */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-[15px]" style={{ color: '#0f1419' }}>
            {displayName}
          </span>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="#1d9bf0">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
          <span className="text-[15px]" style={{ color: '#536471' }}>
            @{username} · 1m
          </span>
        </div>

        {/* Response text */}
        <p
          className="text-[15px] leading-5 mt-1"
          style={{ color: '#0f1419' }}
        >
          {responseText}
        </p>

        {/* Quoted tweet */}
        <div
          className="mt-3 rounded-2xl border p-3"
          style={{ borderColor: '#cfd9de' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: '#536471' }}
            >
              ?
            </div>
            <span className="text-sm" style={{ color: '#536471' }}>
              {targetContext}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const XPreview: React.FC<XPreviewProps> = ({
  content,
  companyName = 'Your Brand',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const parsed = useMemo(() => parseXContent(content), [content]);

  const username = companyName.toLowerCase().replace(/\s+/g, '');
  const displayName = companyName;

  const items = parsed.contentType === 'tweets'
    ? parsed.tweets
    : parsed.contentType === 'thread'
    ? parsed.thread
    : parsed.quoteTweets;

  const totalItems = items.length || 1;

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
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
          {/* X Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: '#eff3f4' }}
          >
            {/* Back arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f1419">
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>

            {/* Title */}
            <div className="flex items-center">
              <span className="font-bold text-lg" style={{ color: '#0f1419' }}>
                {parsed.contentType === 'tweets' && 'Tweets'}
                {parsed.contentType === 'thread' && 'Thread'}
                {parsed.contentType === 'quote-tweets' && 'Quote Tweets'}
              </span>
            </div>

            {/* X Logo */}
            <div style={{ color: '#0f1419' }}>
              <XLogo />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 min-h-[400px]">
            {/* Tweet Pack */}
            {parsed.contentType === 'tweets' && parsed.tweets[currentIndex] && (
              <XTweetDisplay
                text={parsed.tweets[currentIndex].text}
                username={username}
                displayName={displayName}
              />
            )}

            {/* Thread */}
            {parsed.contentType === 'thread' && (
              <div className="space-y-4">
                {parsed.thread.slice(0, currentIndex + 1).map((tweet, idx) => (
                  <XTweetDisplay
                    key={tweet.position}
                    text={tweet.text}
                    username={username}
                    displayName={displayName}
                    isThread={true}
                    isFirst={idx === 0}
                    isLast={idx === currentIndex}
                  />
                ))}
              </div>
            )}

            {/* Quote Tweets */}
            {parsed.contentType === 'quote-tweets' && parsed.quoteTweets[currentIndex] && (
              <QuoteTweetDisplay
                targetContext={parsed.quoteTweets[currentIndex].targetContext}
                responseText={parsed.quoteTweets[currentIndex].responseText}
                username={username}
                displayName={displayName}
              />
            )}
          </div>

          {/* Navigation */}
          {totalItems > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#eff3f4' }}>
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-full text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ background: '#0f1419', color: '#fff' }}
              >
                Previous
              </button>
              <span className="text-sm font-medium" style={{ color: '#536471' }}>
                {currentIndex + 1} / {totalItems}
              </span>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1))}
                disabled={currentIndex === totalItems - 1}
                className="px-4 py-2 rounded-full text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ background: '#0f1419', color: '#fff' }}
              >
                Next
              </button>
            </div>
          )}

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 rounded-full" style={{ background: '#000' }} />
          </div>
        </div>
      </div>

      {/* Tweet thumbnails (outside phone) */}
      {totalItems > 1 && (
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 max-w-[400px]">
          {items.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden p-2 text-left transition-all"
              style={{
                border: idx === currentIndex
                  ? `2px solid ${tokens.colors.ink[700]}`
                  : `1px solid ${tokens.colors.paper.border}`,
                opacity: idx === currentIndex ? 1 : 0.6,
                background: tokens.colors.paper.warm,
              }}
            >
              <p
                className="text-[10px] leading-tight line-clamp-3"
                style={{ color: tokens.colors.text.secondary }}
              >
                {'text' in item ? item.text : item.responseText}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default XPreview;
