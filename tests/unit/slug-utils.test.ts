import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/lib/blog/slug-utils'

describe('generateSlug', () => {
  it('should convert a title to a slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(generateSlug('Hello, World! How are you?')).toBe('hello-world-how-are-you')
  })

  it('should collapse multiple hyphens', () => {
    expect(generateSlug('Hello   World---Test')).toBe('hello-world-test')
  })

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('')
  })

  it('should handle already slugified input', () => {
    expect(generateSlug('already-a-slug')).toBe('already-a-slug')
  })

  it('should trim leading and trailing hyphens', () => {
    expect(generateSlug('  Hello World  ')).toBe('hello-world')
  })

  it('should handle titles with numbers', () => {
    expect(generateSlug('Top 10 Tips for 2025')).toBe('top-10-tips-for-2025')
  })

  it('should handle underscores', () => {
    expect(generateSlug('hello_world_test')).toBe('hello-world-test')
  })
})
