'use client';

/**
 * ADMIN TOGGLE COMPONENT
 *
 * This component provides admin-only control to enable/disable
 * the Generation Theater feature. It's NOT visible to customers.
 *
 * Usage:
 * - Import this in your admin dashboard or settings page
 * - The theater is OFF by default
 * - Only admins can toggle it on for testing
 */

import React, { useState, useEffect } from 'react';
import { TheaterConfig } from './types';

const STORAGE_KEY = 'scribengine_theater_config';

const DEFAULT_CONFIG: TheaterConfig = {
  enabled: false, // OFF by default as requested
  variant: 'minimal',
  showStreamingText: true,
  showStages: true,
  showProgress: true,
  animationSpeed: 'normal',
};

// Hook to manage theater config
export const useTheaterConfig = () => {
  const [config, setConfig] = useState<TheaterConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(stored) });
        } catch (e) {
          console.error('Failed to parse theater config:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when config changes
  const updateConfig = (updates: Partial<TheaterConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    }
  };

  return { config, updateConfig, isLoaded };
};

// Admin toggle panel component
export const TheaterAdminToggle: React.FC<{
  isAdmin: boolean; // Pass this from your auth context
}> = ({ isAdmin }) => {
  const { config, updateConfig, isLoaded } = useTheaterConfig();

  // Don't render anything if not admin
  if (!isAdmin) return null;

  // Don't render until config is loaded (prevents hydration mismatch)
  if (!isLoaded) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded">
            ADMIN ONLY
          </span>
          <h3 className="font-medium text-yellow-900">Generation Theater Settings</h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Master enable/disable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Enable Generation Theater</p>
            <p className="text-sm text-gray-500">
              When enabled, shows animated generation experience instead of simple loading
            </p>
          </div>
          <button
            onClick={() => updateConfig({ enabled: !config.enabled })}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${config.enabled ? 'bg-blue-600' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${config.enabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Only show other options if enabled */}
        {config.enabled && (
          <>
            {/* Variant selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant Style
              </label>
              <select
                value={config.variant}
                onChange={(e) => updateConfig({ variant: e.target.value as TheaterConfig['variant'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="minimal">Minimal Elegant</option>
                <option value="cinematic">Cinematic (Dark)</option>
                <option value="technical">Technical (Dev-friendly)</option>
                <option value="ambient">Ambient (Artistic)</option>
              </select>
            </div>

            {/* Feature toggles */}
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showStreamingText}
                  onChange={(e) => updateConfig({ showStreamingText: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Streaming Text</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showStages}
                  onChange={(e) => updateConfig({ showStages: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Stage Progress</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showProgress}
                  onChange={(e) => updateConfig({ showProgress: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Progress Bar</span>
              </label>
            </div>

            {/* Animation speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed
              </label>
              <div className="flex gap-2">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => updateConfig({ animationSpeed: speed })}
                    className={`
                      px-4 py-2 text-sm rounded-lg capitalize transition-all
                      ${config.animationSpeed === speed
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Warning message */}
      <p className="mt-4 text-xs text-yellow-700">
        This feature is controlled by admins only. Customers will see the standard loading experience unless you enable this.
      </p>
    </div>
  );
};

export default TheaterAdminToggle;
