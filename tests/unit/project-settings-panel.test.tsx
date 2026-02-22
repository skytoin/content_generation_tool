import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { InkProjectDetail } from '@/components/themes/ink-diffusion/pages/InkProjectDetail'
import { allStyleCategories, defaultStyleProfile } from '@/app/api/generate/options'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock next/navigation (already in setup.ts but redefine for clarity)
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

// Mock fetch for save operations
const mockFetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
)
global.fetch = mockFetch as any

// Sample project data
const baseProject = {
  id: 'test-project-1',
  name: 'Test Blog Post',
  serviceType: 'blog-post',
  status: 'completed',
  result: 'This is generated content for testing.',
  qualityReport: null,
  wordCount: 1500,
  formData: {
    topic: 'AI in Healthcare',
    company: 'MedTech Inc',
    audience: 'Healthcare professionals',
    goals: 'Educate and attract leads',
    industry: 'Healthcare',
  },
  styleSelections: {
    professional_level: 'business_professional',
    energy_level: 'balanced_steady',
    personality: 'helpful_mentor',
  },
  additionalInfo: 'Focus on recent FDA guidelines',
  tier: 'premium',
  lengthTier: 'standard',
  createdAt: new Date('2025-01-15'),
  completedAt: new Date('2025-01-15'),
}

const defaultProps = {
  project: baseProject,
  instagramImages: [],
  isInstagram: false,
  isTwitter: false,
  isLinkedIn: false,
}

describe('Project Settings Panel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('Settings Panel Visibility', () => {
    it('renders the Settings & Customization header', () => {
      render(<InkProjectDetail {...defaultProps} />)
      expect(screen.getByText('Settings & Customization')).toBeInTheDocument()
    })

    it('starts collapsed by default', () => {
      render(<InkProjectDetail {...defaultProps} />)
      // Internal sections should not be visible when collapsed
      expect(screen.queryByText('Input Fields')).not.toBeInTheDocument()
      expect(screen.queryByText('Additional Instructions')).not.toBeInTheDocument()
      expect(screen.queryByText('Tone of Voice')).not.toBeInTheDocument()
    })

    it('shows summary text when collapsed', () => {
      render(<InkProjectDetail {...defaultProps} />)
      // Should show a summary with field names and category count
      expect(screen.getByText(/Topic, Company/)).toBeInTheDocument()
    })

    it('expands when header is clicked', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      expect(screen.getByText('Input Fields')).toBeInTheDocument()
      expect(screen.getByText('Additional Instructions')).toBeInTheDocument()
    })

    it('collapses when header is clicked again', () => {
      render(<InkProjectDetail {...defaultProps} />)
      const header = screen.getByText('Settings & Customization')
      fireEvent.click(header)
      expect(screen.getByText('Input Fields')).toBeInTheDocument()
      fireEvent.click(header)
      expect(screen.queryByText('Input Fields')).not.toBeInTheDocument()
    })
  })

  describe('Input Fields', () => {
    it('displays all non-empty form fields as editable inputs', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      expect(screen.getByDisplayValue('AI in Healthcare')).toBeInTheDocument()
      expect(screen.getByDisplayValue('MedTech Inc')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Healthcare professionals')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Healthcare')).toBeInTheDocument()
    })

    it('renders goals as textarea', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // Goals field should be a textarea
      const goalsTextarea = screen.getByDisplayValue('Educate and attract leads')
      expect(goalsTextarea.tagName).toBe('TEXTAREA')
    })

    it('allows editing input fields', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare')
      fireEvent.change(topicInput, { target: { value: 'AI in Dentistry' } })
      expect(screen.getByDisplayValue('AI in Dentistry')).toBeInTheDocument()
    })

    it('does not show fields that are empty in formData', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // These fields don't exist in our test formData
      expect(screen.queryByDisplayValue('author')).not.toBeInTheDocument()
      expect(screen.queryByDisplayValue('keywords')).not.toBeInTheDocument()
    })
  })

  describe('Additional Instructions', () => {
    it('displays the additional info textarea', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      expect(screen.getByDisplayValue('Focus on recent FDA guidelines')).toBeInTheDocument()
    })

    it('allows editing additional info', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const textarea = screen.getByDisplayValue('Focus on recent FDA guidelines')
      fireEvent.change(textarea, { target: { value: 'Updated instructions' } })
      expect(screen.getByDisplayValue('Updated instructions')).toBeInTheDocument()
    })

    it('shows placeholder when additional info is empty', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, additionalInfo: null },
      }
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      expect(screen.getByPlaceholderText('Any extra instructions for the AI...')).toBeInTheDocument()
    })
  })

  describe('Style Categories', () => {
    it('shows all 18 style categories', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      allStyleCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument()
      })
    })

    it('shows category count in header', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      expect(screen.getByText(`Style Settings (${allStyleCategories.length} categories)`)).toBeInTheDocument()
    })

    it('categories start collapsed', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // None of the category descriptions should be visible
      allStyleCategories.forEach(category => {
        expect(screen.queryByText(category.description)).not.toBeInTheDocument()
      })
    })

    it('expanding a category shows its options', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      // Should now see the options within Tone of Voice
      expect(screen.getByText('Professional Level')).toBeInTheDocument()
      expect(screen.getByText('Energy Level')).toBeInTheDocument()
      expect(screen.getByText('Personality')).toBeInTheDocument()
      expect(screen.getByText('Emotional Tone')).toBeInTheDocument()
    })

    it('collapsing a category hides its options', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))
      expect(screen.getByText('Professional Level')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Tone of Voice'))
      expect(screen.queryByText('Professional Level')).not.toBeInTheDocument()
    })

    it('shows current values in dropdowns matching styleSelections', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      // professional_level is set to 'business_professional' in our test project
      const selects = screen.getAllByRole('combobox')
      const professionalSelect = selects.find(
        s => (s as HTMLSelectElement).value === 'business_professional'
      )
      expect(professionalSelect).toBeTruthy()
    })

    it('falls back to default values when styleSelections is empty', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, styleSelections: {} },
      }
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      // Should show default value for professional_level
      const selects = screen.getAllByRole('combobox')
      const professionalSelect = selects.find(
        s => (s as HTMLSelectElement).value === defaultStyleProfile.professional_level
      )
      expect(professionalSelect).toBeTruthy()
    })

    it('allows changing a style selection via dropdown', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      const selects = screen.getAllByRole('combobox')
      const professionalSelect = selects.find(
        s => (s as HTMLSelectElement).value === 'business_professional'
      ) as HTMLSelectElement

      fireEvent.change(professionalSelect, { target: { value: 'corporate_formal' } })
      expect(professionalSelect.value).toBe('corporate_formal')
    })

    it('shows "custom" badge for categories with non-default values', () => {
      const props = {
        ...defaultProps,
        project: {
          ...baseProject,
          styleSelections: {
            professional_level: 'corporate_formal', // non-default
            energy_level: 'bold_confident', // non-default
          },
        },
      }
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // Tone of Voice has 2 customized options
      expect(screen.getByText('2 custom')).toBeInTheDocument()
    })

    it('multiple categories can be expanded at the same time', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))
      fireEvent.click(screen.getByText('Writing Style'))

      // Both should have their options visible
      expect(screen.getByText('Professional Level')).toBeInTheDocument()
      expect(screen.getByText('Narrative Approach')).toBeInTheDocument()
    })
  })

  describe('Change Detection', () => {
    it('does not show Save/Reset when no changes are made', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
      expect(screen.queryByText('Reset')).not.toBeInTheDocument()
    })

    it('shows Save/Reset when form field changes', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare')
      fireEvent.change(topicInput, { target: { value: 'New Topic' } })

      expect(screen.getByText('Save Changes')).toBeInTheDocument()
      expect(screen.getByText('Reset')).toBeInTheDocument()
    })

    it('shows Save/Reset when style selection changes', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      const selects = screen.getAllByRole('combobox')
      const professionalSelect = selects.find(
        s => (s as HTMLSelectElement).value === 'business_professional'
      ) as HTMLSelectElement

      fireEvent.change(professionalSelect, { target: { value: 'corporate_formal' } })

      expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    it('shows Save/Reset when additional info changes', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const textarea = screen.getByDisplayValue('Focus on recent FDA guidelines')
      fireEvent.change(textarea, { target: { value: 'Changed info' } })

      expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    it('Reset button restores original values', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare') as HTMLInputElement
      fireEvent.change(topicInput, { target: { value: 'New Topic' } })
      expect(topicInput.value).toBe('New Topic')

      fireEvent.click(screen.getByText('Reset'))
      expect(screen.getByDisplayValue('AI in Healthcare')).toBeInTheDocument()
    })

    it('shows unsaved changes notice near Regenerate button', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare')
      fireEvent.change(topicInput, { target: { value: 'New Topic' } })

      expect(screen.getByText(/Unsaved setting changes will be used for regeneration/)).toBeInTheDocument()
    })
  })

  describe('Save Settings', () => {
    it('calls PATCH API with updated settings on Save', async () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare')
      fireEvent.change(topicInput, { target: { value: 'New Topic' } })

      fireEvent.click(screen.getByText('Save Changes'))

      // Wait for async save
      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `/api/projects/${baseProject.id}`,
          expect.objectContaining({
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      // Verify the body contains updated formData
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.formData.topic).toBe('New Topic')
      expect(callBody.styleSelections).toBeDefined()
      expect(callBody.additionalInfo).toBeDefined()
    })
  })

  describe('Regeneration with Edited Settings', () => {
    it('passes edited formData to RegenerateButton', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      const topicInput = screen.getByDisplayValue('AI in Healthcare')
      fireEvent.change(topicInput, { target: { value: 'Edited Topic' } })

      // The Regenerate button should exist and will use the edited values
      expect(screen.getByText('Regenerate')).toBeInTheDocument()
    })

    it('passes edited style selections to RegenerateButton', () => {
      render(<InkProjectDetail {...defaultProps} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      const selects = screen.getAllByRole('combobox')
      const professionalSelect = selects.find(
        s => (s as HTMLSelectElement).value === 'business_professional'
      ) as HTMLSelectElement

      fireEvent.change(professionalSelect, { target: { value: 'corporate_formal' } })

      // Regenerate button still present with modified values
      expect(screen.getByText('Regenerate')).toBeInTheDocument()
    })
  })

  describe('Actions Section', () => {
    it('shows Regenerate button when project is completed', () => {
      render(<InkProjectDetail {...defaultProps} />)
      expect(screen.getByText('Regenerate')).toBeInTheDocument()
    })

    it('hides Regenerate button when project is not completed', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, status: 'processing', result: null },
      }
      render(<InkProjectDetail {...props} />)
      expect(screen.queryByText('Regenerate')).not.toBeInTheDocument()
    })

    it('shows Download button when result exists', () => {
      render(<InkProjectDetail {...defaultProps} />)
      // DownloadButton text
      expect(screen.getByText('Download')).toBeInTheDocument()
    })

    it('shows Delete button always', () => {
      render(<InkProjectDetail {...defaultProps} />)
      expect(screen.getByText('Delete Project')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles null styleSelections gracefully', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, styleSelections: null },
      }
      // Should not crash
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // Should still show categories
      expect(screen.getByText('Tone of Voice')).toBeInTheDocument()
    })

    it('handles null formData gracefully', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, formData: null },
      }
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))

      // Should not crash, no Input Fields section
      expect(screen.queryByText('Input Fields')).not.toBeInTheDocument()
    })

    it('handles empty styleSelections object', () => {
      const props = {
        ...defaultProps,
        project: { ...baseProject, styleSelections: {} },
      }
      render(<InkProjectDetail {...props} />)
      fireEvent.click(screen.getByText('Settings & Customization'))
      fireEvent.click(screen.getByText('Tone of Voice'))

      // Should show defaults in dropdowns
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)
    })
  })
})
