/**
 * Ideogram Client Unit Tests
 *
 * Tests for the Ideogram API client utility functions.
 * These tests do NOT make actual API calls - they test the helper functions.
 */

import { describe, it, expect } from 'vitest'
import {
  mapStyleToPreset,
  recommendImageGenerator
} from '@/app/api/generate/ideogram-client'

describe('Ideogram Client Utilities', () => {
  describe('mapStyleToPreset', () => {
    it('should map photography style correctly', () => {
      expect(mapStyleToPreset('photography')).toBe('PHOTOGRAPHY')
    })

    it('should map illustration to digital art', () => {
      expect(mapStyleToPreset('illustration')).toBe('DIGITAL_ART')
    })

    it('should map minimalist style correctly', () => {
      expect(mapStyleToPreset('minimalist')).toBe('MINIMALIST')
    })

    it('should map 3d_render style correctly', () => {
      expect(mapStyleToPreset('3d_render')).toBe('3D_RENDER')
    })

    it('should map flat_design style correctly', () => {
      expect(mapStyleToPreset('flat_design')).toBe('FLAT_DESIGN')
    })

    it('should map watercolor style correctly', () => {
      expect(mapStyleToPreset('watercolor')).toBe('WATERCOLOR')
    })

    it('should map cinematic style correctly', () => {
      expect(mapStyleToPreset('cinematic')).toBe('CINEMATIC')
    })

    it('should map anime style correctly', () => {
      expect(mapStyleToPreset('anime')).toBe('ANIME')
    })

    it('should map vintage style correctly', () => {
      expect(mapStyleToPreset('vintage')).toBe('VINTAGE')
    })

    it('should map neon style correctly', () => {
      expect(mapStyleToPreset('neon')).toBe('NEON')
    })

    it('should be case insensitive', () => {
      expect(mapStyleToPreset('PHOTOGRAPHY')).toBe('PHOTOGRAPHY')
      expect(mapStyleToPreset('Photography')).toBe('PHOTOGRAPHY')
      expect(mapStyleToPreset('pHoToGrApHy')).toBe('PHOTOGRAPHY')
    })

    it('should return AUTO for unknown styles', () => {
      expect(mapStyleToPreset('unknown')).toBe('AUTO')
      expect(mapStyleToPreset('random')).toBe('AUTO')
      expect(mapStyleToPreset('')).toBe('AUTO')
    })
  })

  describe('recommendImageGenerator', () => {
    describe('text overlay detection', () => {
      it('should recommend ideogram for slides with text overlay', () => {
        const result = recommendImageGenerator({
          hasTextOverlay: true,
          textLength: 50,
        })
        expect(result).toBe('ideogram')
      })

      it('should recommend dalle for minimal text', () => {
        const result = recommendImageGenerator({
          hasTextOverlay: true,
          textLength: 5,
        })
        expect(result).toBe('dalle')
      })

      it('should recommend dalle when no text overlay', () => {
        const result = recommendImageGenerator({
          hasTextOverlay: false,
          textLength: 100,
        })
        expect(result).toBe('dalle')
      })
    })

    describe('purpose-based detection', () => {
      it('should recommend ideogram for hook slides', () => {
        expect(recommendImageGenerator({ purpose: 'hook' })).toBe('ideogram')
      })

      it('should recommend ideogram for title slides', () => {
        expect(recommendImageGenerator({ purpose: 'title' })).toBe('ideogram')
      })

      it('should recommend ideogram for quote slides', () => {
        expect(recommendImageGenerator({ purpose: 'quote' })).toBe('ideogram')
      })

      it('should recommend ideogram for CTA slides', () => {
        expect(recommendImageGenerator({ purpose: 'cta' })).toBe('ideogram')
      })

      it('should recommend ideogram for summary slides', () => {
        expect(recommendImageGenerator({ purpose: 'summary' })).toBe('ideogram')
      })

      it('should be case insensitive for purposes', () => {
        expect(recommendImageGenerator({ purpose: 'HOOK' })).toBe('ideogram')
        expect(recommendImageGenerator({ purpose: 'Title' })).toBe('ideogram')
      })

      it('should recommend dalle for content slides', () => {
        expect(recommendImageGenerator({ purpose: 'content' })).toBe('dalle')
        expect(recommendImageGenerator({ purpose: 'illustration' })).toBe('dalle')
      })
    })

    describe('style-based detection', () => {
      it('should recommend ideogram for minimalist style', () => {
        expect(recommendImageGenerator({ style: 'minimalist' })).toBe('ideogram')
      })

      it('should recommend ideogram for flat_design style', () => {
        expect(recommendImageGenerator({ style: 'flat_design' })).toBe('ideogram')
      })

      it('should recommend ideogram for 3d_render style', () => {
        expect(recommendImageGenerator({ style: '3d_render' })).toBe('ideogram')
      })

      it('should recommend ideogram for geometric style', () => {
        expect(recommendImageGenerator({ style: 'geometric' })).toBe('ideogram')
      })

      it('should recommend dalle for photography style', () => {
        expect(recommendImageGenerator({ style: 'photography' })).toBe('dalle')
      })

      it('should recommend dalle for illustration style', () => {
        expect(recommendImageGenerator({ style: 'illustration' })).toBe('dalle')
      })
    })

    describe('default behavior', () => {
      it('should default to dalle with no inputs', () => {
        expect(recommendImageGenerator({})).toBe('dalle')
      })

      it('should default to dalle for photorealistic content', () => {
        expect(recommendImageGenerator({
          hasTextOverlay: false,
          purpose: 'photo',
          style: 'photography',
        })).toBe('dalle')
      })
    })

    describe('priority order', () => {
      it('should prioritize text overlay over style', () => {
        const result = recommendImageGenerator({
          hasTextOverlay: true,
          textLength: 50,
          style: 'photography', // Would normally suggest dalle
        })
        expect(result).toBe('ideogram')
      })

      it('should prioritize purpose over style', () => {
        const result = recommendImageGenerator({
          purpose: 'hook',
          style: 'photography', // Would normally suggest dalle
        })
        expect(result).toBe('ideogram')
      })
    })
  })
})
