import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegenerateButton } from '@/components/dashboard/ProjectActions'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/dashboard/projects/test-id'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Track all fetch calls
let fetchCalls: { url: string; options: any }[] = []

const mockFetch = vi.fn((url: string, options?: any) => {
  fetchCalls.push({ url, options })

  // Mock successful generate API response
  if (url === '/api/generate') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        content: 'Generated content from new settings.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQuality Report',
      }),
    })
  }

  // Mock successful Instagram generate API response
  if (url === '/api/generate/instagram') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        content: {
          caption: 'Instagram caption',
          hashtags: ['#test'],
          altText: 'Alt text',
          slides: [],
        },
        images: [],
      }),
    })
  }

  // Mock X/Twitter API responses
  if (url === '/api/generate/x/tweets') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        tweets: [
          { text: 'Tweet 1 content', characterCount: 50, contentType: 'insight' },
          { text: 'Tweet 2 content', characterCount: 60, contentType: 'opinion' },
        ],
        qualityReport: { overallScore: 8, shadowbanRisk: 'low' },
      }),
    })
  }

  if (url === '/api/generate/x/threads') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        thread: [
          { position: 1, text: 'Thread tweet 1', characterCount: 80, purpose: 'hook' },
          { position: 2, text: 'Thread tweet 2', characterCount: 90, purpose: 'body' },
        ],
        hookVariations: ['Alt hook 1'],
        qualityReport: { overallScore: 9, hookScore: 8, flowScore: 9 },
      }),
    })
  }

  if (url === '/api/generate/x/quote-tweets') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        quoteTweets: [
          { targetContext: '@user post', responseText: 'Quote response', characterCount: 70, quoteType: 'insight' },
        ],
        qualityReport: { overallScore: 7, authenticityScore: 8, valueAddScore: 7 },
      }),
    })
  }

  // Mock LinkedIn API responses
  if (url === '/api/generate/linkedin/text-posts') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        posts: [
          { text: 'LinkedIn post 1', characterCount: 200, contentType: 'insight', hashtags: ['#leadership'], firstComment: 'First comment' },
        ],
        qualityReport: { overallScore: 8, algorithmScore: 7 },
      }),
    })
  }

  if (url === '/api/generate/linkedin/carousels') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        carousels: [
          { caption: 'Carousel caption', captionCharacterCount: 100, slides: [{ slideNumber: 1, headline: 'Slide 1', body: 'Content', visualDirection: 'diagram' }], hashtags: ['#carousel'], firstComment: 'Comment' },
        ],
        qualityReport: { overallScore: 9, algorithmScore: 8 },
      }),
    })
  }

  if (url === '/api/generate/linkedin/articles') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        articles: [
          { title: 'Article Title', subtitle: 'Subtitle', body: 'Article body text', wordCount: 500, companionPost: 'Check out my article', companionPostFirstComment: 'Comment', seoKeywords: ['leadership'] },
        ],
        qualityReport: { overallScore: 8, depthScore: 9 },
      }),
    })
  }

  if (url === '/api/generate/linkedin/polls') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        polls: [
          { question: 'Best practice?', questionCharacterCount: 15, options: ['Option A', 'Option B'], companionText: 'Vote now', firstComment: 'My take', pollType: 'opinion' },
        ],
        qualityReport: { overallScore: 7, engagementPrediction: 8 },
      }),
    })
  }

  // Mock PATCH responses
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
})

global.fetch = mockFetch as any

// Mock window.confirm
global.confirm = vi.fn(() => true)

describe('RegenerateButton sends edited settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchCalls = []
  })

  const originalFormData = {
    topic: 'Original Topic',
    company: 'Original Corp',
    audience: 'Developers',
    goals: 'Educate',
  }

  const editedFormData = {
    topic: 'Edited Topic',
    company: 'New Corp',
    audience: 'Designers',
    goals: 'Convert leads',
  }

  const originalStyleSelections = {
    professional_level: 'business_professional',
    energy_level: 'balanced_steady',
  }

  const editedStyleSelections = {
    professional_level: 'corporate_formal',
    energy_level: 'bold_confident',
    personality: 'authoritative_leader',
  }

  describe('Blog / Standard content', () => {
    it('sends edited formData to the generate API', async () => {
      render(
        <RegenerateButton
          projectId="project-123"
          serviceType="blog-post"
          formData={editedFormData}
          styleSelections={originalStyleSelections}
          additionalInfo="Original info"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.formData.company).toBe('New Corp')
        expect(body.formData.audience).toBe('Designers')
        expect(body.formData.goals).toBe('Convert leads')
      })
    })

    it('sends edited styleSelections to the generate API', async () => {
      render(
        <RegenerateButton
          projectId="project-123"
          serviceType="blog-post"
          formData={originalFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Original info"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.styleSelections.energy_level).toBe('bold_confident')
        expect(body.styleSelections.personality).toBe('authoritative_leader')
      })
    })

    it('sends edited additionalInfo to the generate API', async () => {
      render(
        <RegenerateButton
          projectId="project-123"
          serviceType="blog-post"
          formData={originalFormData}
          styleSelections={originalStyleSelections}
          additionalInfo="Edited additional instructions for AI"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.additionalInfo).toBe('Edited additional instructions for AI')
      })
    })

    it('persists edited settings to database after generation', async () => {
      render(
        <RegenerateButton
          projectId="project-123"
          serviceType="blog-post"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="New instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        // Find the final PATCH call (the one that saves result, not the status update)
        const patchCalls = fetchCalls.filter(
          c => c.url === '/api/projects/project-123' && c.options?.method === 'PATCH'
        )
        // Should have 2 PATCH calls: 1st sets status to processing, 2nd saves result + settings
        expect(patchCalls.length).toBe(2)

        const savePatch = patchCalls[1]
        const body = JSON.parse(savePatch.options.body)

        // Verify settings are persisted alongside result
        expect(body.status).toBe('completed')
        expect(body.result).toContain('Generated content from new settings')
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.formData.company).toBe('New Corp')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.styleSelections.energy_level).toBe('bold_confident')
        expect(body.additionalInfo).toBe('New instructions')
      })
    })

    it('sends all three edited settings together in one generation', async () => {
      render(
        <RegenerateButton
          projectId="project-123"
          serviceType="blog-post"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Completely new instructions"
          tier="standard"
          lengthTier="long"
          existingResult="Old content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)

        // All three edited settings in the same request
        expect(body.formData).toEqual(editedFormData)
        expect(body.styleSelections).toEqual(editedStyleSelections)
        expect(body.additionalInfo).toBe('Completely new instructions')
        expect(body.tier).toBe('standard')
        expect(body.lengthTier).toBe('long')
      })
    })
  })

  describe('Instagram content', () => {
    it('sends edited settings to Instagram generate API', async () => {
      render(
        <RegenerateButton
          projectId="project-456"
          serviceType="instagram"
          formData={{ ...editedFormData, imageOptions: { generateImages: true } }}
          styleSelections={editedStyleSelections}
          additionalInfo="Instagram-specific instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing IG content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/instagram')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('Instagram-specific instructions')
      })
    })

    it('persists edited settings to database after Instagram generation', async () => {
      render(
        <RegenerateButton
          projectId="project-456"
          serviceType="instagram"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="New IG instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing IG content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const patchCalls = fetchCalls.filter(
          c => c.url === '/api/projects/project-456' && c.options?.method === 'PATCH'
        )
        expect(patchCalls.length).toBe(2)

        const savePatch = patchCalls[1]
        const body = JSON.parse(savePatch.options.body)

        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('New IG instructions')
      })
    })
  })

  describe('X/Twitter content', () => {
    it('routes x-tweets to /api/generate/x/tweets with edited settings', async () => {
      render(
        <RegenerateButton
          projectId="project-x1"
          serviceType="x-tweets"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="X tweet instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing tweets"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/x/tweets')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('X tweet instructions')
      })
    })

    it('routes x-thread to /api/generate/x/threads with edited settings', async () => {
      render(
        <RegenerateButton
          projectId="project-x2"
          serviceType="x-thread"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Thread instructions"
          tier="standard"
          lengthTier="standard"
          existingResult="Existing thread"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/x/threads')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.energy_level).toBe('bold_confident')
      })
    })

    it('routes x-quote-tweets to /api/generate/x/quote-tweets', async () => {
      render(
        <RegenerateButton
          projectId="project-x3"
          serviceType="x-quote-tweets"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Quote instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing quotes"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/x/quote-tweets')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.company).toBe('New Corp')
        expect(body.additionalInfo).toBe('Quote instructions')
      })
    })

    it('persists edited settings after X tweet generation', async () => {
      render(
        <RegenerateButton
          projectId="project-x1"
          serviceType="x-tweets"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="New X instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing tweets"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const patchCalls = fetchCalls.filter(
          c => c.url === '/api/projects/project-x1' && c.options?.method === 'PATCH'
        )
        expect(patchCalls.length).toBe(2)

        const savePatch = patchCalls[1]
        const body = JSON.parse(savePatch.options.body)

        expect(body.status).toBe('completed')
        expect(body.result).toContain('X TWEET PACK')
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('New X instructions')
      })
    })

    it('does NOT route X content to generic /api/generate', async () => {
      render(
        <RegenerateButton
          projectId="project-x1"
          serviceType="x-tweets"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="X instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing tweets"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const xCall = fetchCalls.find(c => c.url === '/api/generate/x/tweets')
        expect(xCall).toBeTruthy()
      })

      // Verify no call to generic /api/generate
      const genericCall = fetchCalls.find(c => c.url === '/api/generate')
      expect(genericCall).toBeUndefined()
    })
  })

  describe('LinkedIn content', () => {
    it('routes linkedin-text-posts to /api/generate/linkedin/text-posts', async () => {
      render(
        <RegenerateButton
          projectId="project-li1"
          serviceType="linkedin-text-posts"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="LinkedIn text post instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing posts"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/linkedin/text-posts')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('LinkedIn text post instructions')
      })
    })

    it('routes linkedin-carousel to /api/generate/linkedin/carousels', async () => {
      render(
        <RegenerateButton
          projectId="project-li2"
          serviceType="linkedin-carousel"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Carousel instructions"
          tier="standard"
          lengthTier="standard"
          existingResult="Existing carousel"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/linkedin/carousels')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.company).toBe('New Corp')
        expect(body.styleSelections.energy_level).toBe('bold_confident')
      })
    })

    it('routes linkedin-article to /api/generate/linkedin/articles', async () => {
      render(
        <RegenerateButton
          projectId="project-li3"
          serviceType="linkedin-article"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Article instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing article"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/linkedin/articles')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.additionalInfo).toBe('Article instructions')
      })
    })

    it('routes linkedin-polls to /api/generate/linkedin/polls', async () => {
      render(
        <RegenerateButton
          projectId="project-li4"
          serviceType="linkedin-polls"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="Poll instructions"
          tier="standard"
          lengthTier="standard"
          existingResult="Existing polls"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate/linkedin/polls')
        expect(generateCall).toBeTruthy()

        const body = JSON.parse(generateCall!.options.body)
        expect(body.formData.audience).toBe('Designers')
        expect(body.additionalInfo).toBe('Poll instructions')
      })
    })

    it('persists edited settings after LinkedIn text-posts generation', async () => {
      render(
        <RegenerateButton
          projectId="project-li1"
          serviceType="linkedin-text-posts"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="New LinkedIn instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing posts"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const patchCalls = fetchCalls.filter(
          c => c.url === '/api/projects/project-li1' && c.options?.method === 'PATCH'
        )
        expect(patchCalls.length).toBe(2)

        const savePatch = patchCalls[1]
        const body = JSON.parse(savePatch.options.body)

        expect(body.status).toBe('completed')
        expect(body.result).toContain('LINKEDIN TEXT POSTS')
        expect(body.formData.topic).toBe('Edited Topic')
        expect(body.styleSelections.professional_level).toBe('corporate_formal')
        expect(body.additionalInfo).toBe('New LinkedIn instructions')
      })
    })

    it('does NOT route LinkedIn content to generic /api/generate', async () => {
      render(
        <RegenerateButton
          projectId="project-li1"
          serviceType="linkedin-text-posts"
          formData={editedFormData}
          styleSelections={editedStyleSelections}
          additionalInfo="LinkedIn instructions"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing posts"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const liCall = fetchCalls.find(c => c.url === '/api/generate/linkedin/text-posts')
        expect(liCall).toBeTruthy()
      })

      // Verify no call to generic /api/generate
      const genericCall = fetchCalls.find(c => c.url === '/api/generate')
      expect(genericCall).toBeUndefined()
    })
  })

  describe('Unchanged settings still work', () => {
    it('sends original settings when nothing was changed', async () => {
      render(
        <RegenerateButton
          projectId="project-789"
          serviceType="blog-post"
          formData={originalFormData}
          styleSelections={originalStyleSelections}
          additionalInfo="Original info"
          tier="premium"
          lengthTier="standard"
          existingResult="Existing content"
        />
      )

      fireEvent.click(screen.getByText('Regenerate'))

      await waitFor(() => {
        const generateCall = fetchCalls.find(c => c.url === '/api/generate')
        const body = JSON.parse(generateCall!.options.body)

        expect(body.formData).toEqual(originalFormData)
        expect(body.styleSelections).toEqual(originalStyleSelections)
        expect(body.additionalInfo).toBe('Original info')
      })
    })
  })
})
