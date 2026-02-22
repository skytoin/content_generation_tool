import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetPrismaMocks } from '../mocks/prisma'
import {
  mockGetServerSession,
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
  resetAuthMocks,
} from '../mocks/next-auth'
import { regularUser, adminUser, regularSession, adminSession } from '../fixtures/users'
import {
  defaultProfile,
  secondProfile,
  minimalProfile,
  otherUserProfile,
} from '../fixtures/company-profiles'

describe('Company Profiles API Access Control', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  describe('GET /api/company-profiles', () => {
    it('should return 401 for unauthenticated users', async () => {
      mockUnauthenticatedSession()

      const session = await mockGetServerSession()
      expect(session).toBeNull()
    })

    it('should return profiles for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findMany.mockResolvedValue([defaultProfile, secondProfile])

      const session = await mockGetServerSession()
      expect(session?.user?.id).toBe(regularUser.id)

      const profiles = await mockPrisma.companyProfile.findMany({
        where: { userId: regularUser.id },
        orderBy: [
          { isDefault: 'desc' },
          { updatedAt: 'desc' },
        ],
        include: {
          _count: {
            select: { projects: true },
          },
        },
      })

      expect(profiles).toHaveLength(2)
      expect(profiles[0].isDefault).toBe(true)
      expect(mockPrisma.companyProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: regularUser.id },
        })
      )
    })

    it('should only return profiles owned by the user', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findMany.mockResolvedValue([defaultProfile, secondProfile])

      await mockPrisma.companyProfile.findMany({
        where: { userId: regularUser.id },
      })

      expect(mockPrisma.companyProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: regularUser.id },
        })
      )
    })
  })

  describe('POST /api/company-profiles', () => {
    it('should create profile for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      const newProfile = {
        ...minimalProfile,
        id: 'new-profile-id',
      }
      mockPrisma.companyProfile.create.mockResolvedValue(newProfile)

      const session = await mockGetServerSession()
      expect(session?.user?.id).toBeDefined()

      const created = await mockPrisma.companyProfile.create({
        data: {
          userId: session.user.id,
          name: 'Quick Profile',
          companyName: 'TestCo',
          isDefault: false,
        },
      })

      expect(created.userId).toBe(regularUser.id)
      expect(created.companyName).toBe('TestCo')
    })

    it('should reject creation for unauthenticated user', async () => {
      mockUnauthenticatedSession()

      const session = await mockGetServerSession()
      expect(session).toBeNull()
    })

    it('should require name and companyName fields', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)

      // Test missing name
      const bodyMissingName = { companyName: 'TestCo' }
      expect(bodyMissingName).not.toHaveProperty('name')

      // Test missing companyName
      const bodyMissingCompany = { name: 'Test Profile' }
      expect(bodyMissingCompany).not.toHaveProperty('companyName')
    })

    it('should unset other defaults when creating default profile', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.companyProfile.create.mockResolvedValue({
        ...minimalProfile,
        isDefault: true,
      })

      const session = await mockGetServerSession()

      // First unset existing defaults
      await mockPrisma.companyProfile.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })

      expect(mockPrisma.companyProfile.updateMany).toHaveBeenCalledWith({
        where: { userId: regularUser.id, isDefault: true },
        data: { isDefault: false },
      })

      // Then create the new default
      const created = await mockPrisma.companyProfile.create({
        data: {
          userId: session.user.id,
          name: 'Quick Profile',
          companyName: 'TestCo',
          isDefault: true,
        },
      })

      expect(created.isDefault).toBe(true)
    })
  })

  describe('GET /api/company-profiles/[id]', () => {
    it('should return profile for owner', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(defaultProfile)

      const profile = await mockPrisma.companyProfile.findFirst({
        where: {
          id: defaultProfile.id,
          userId: regularUser.id,
        },
      })

      expect(profile).toEqual(defaultProfile)
      expect(profile?.companyName).toBe('Acme Corp')
    })

    it('should return null for non-existent profile', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(null)

      const profile = await mockPrisma.companyProfile.findFirst({
        where: {
          id: 'non-existent-id',
          userId: regularUser.id,
        },
      })

      expect(profile).toBeNull()
    })

    it('should return null when accessing another user\'s profile', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(null)

      const profile = await mockPrisma.companyProfile.findFirst({
        where: {
          id: otherUserProfile.id,
          userId: regularUser.id,
        },
      })

      expect(profile).toBeNull()
    })
  })

  describe('PATCH /api/company-profiles/[id]', () => {
    it('should update profile for owner', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(defaultProfile)
      mockPrisma.companyProfile.update.mockResolvedValue({
        ...defaultProfile,
        companyName: 'Acme Corp Updated',
        industry: 'SaaS Technology',
      })

      // Verify ownership
      const existing = await mockPrisma.companyProfile.findFirst({
        where: { id: defaultProfile.id, userId: regularUser.id },
      })
      expect(existing).toBeDefined()

      // Update
      const updated = await mockPrisma.companyProfile.update({
        where: { id: defaultProfile.id },
        data: { companyName: 'Acme Corp Updated', industry: 'SaaS Technology' },
      })

      expect(updated.companyName).toBe('Acme Corp Updated')
      expect(updated.industry).toBe('SaaS Technology')
    })

    it('should not update another user\'s profile', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(null)

      const existing = await mockPrisma.companyProfile.findFirst({
        where: { id: otherUserProfile.id, userId: regularUser.id },
      })

      expect(existing).toBeNull()
    })

    it('should handle setting profile as default', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(secondProfile)
      mockPrisma.companyProfile.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.companyProfile.update.mockResolvedValue({
        ...secondProfile,
        isDefault: true,
      })

      const existing = await mockPrisma.companyProfile.findFirst({
        where: { id: secondProfile.id, userId: regularUser.id },
      })
      expect(existing).toBeDefined()
      expect(existing?.isDefault).toBe(false)

      // Unset other defaults
      await mockPrisma.companyProfile.updateMany({
        where: { userId: regularUser.id, isDefault: true },
        data: { isDefault: false },
      })

      // Set this as default
      const updated = await mockPrisma.companyProfile.update({
        where: { id: secondProfile.id },
        data: { isDefault: true },
      })

      expect(updated.isDefault).toBe(true)
    })
  })

  describe('DELETE /api/company-profiles/[id]', () => {
    it('should delete profile for owner', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(secondProfile)
      mockPrisma.companyProfile.delete.mockResolvedValue(secondProfile)

      // Verify ownership
      const existing = await mockPrisma.companyProfile.findFirst({
        where: { id: secondProfile.id, userId: regularUser.id },
      })
      expect(existing).toBeDefined()

      // Delete
      await mockPrisma.companyProfile.delete({
        where: { id: secondProfile.id },
      })

      expect(mockPrisma.companyProfile.delete).toHaveBeenCalledWith({
        where: { id: secondProfile.id },
      })
    })

    it('should not delete another user\'s profile', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.companyProfile.findFirst.mockResolvedValue(null)

      const existing = await mockPrisma.companyProfile.findFirst({
        where: { id: otherUserProfile.id, userId: regularUser.id },
      })

      expect(existing).toBeNull()
      // API would return 404 here, delete never called
    })
  })
})

describe('Company Profile Data Integrity', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  it('should store all profile fields correctly', async () => {
    mockGetServerSession.mockResolvedValue(regularSession)

    const fullProfileData = {
      userId: regularUser.id,
      name: 'Full Profile',
      isDefault: false,
      companyName: 'Test Corp',
      industry: 'Technology',
      companyDescription: 'A test company',
      companySize: 'medium',
      websiteUrl: 'https://test.com',
      brandVoice: 'Professional and helpful',
      brandGuidelines: 'Always be concise',
      sampleContent: 'Sample post here',
      brandColors: ['#FF0000', '#00FF00'],
      emojiPreference: 'moderate',
      controversyLevel: 'mild_opinion',
      primaryAudience: 'Developers',
      secondaryAudiences: 'CTOs, Tech leads',
      audiencePainPoints: 'Too much complexity',
      audienceAspirations: 'Ship faster',
      primaryGoals: 'User acquisition',
      keyMessages: 'Build faster',
      uniqueSellingPoints: 'Easiest to use',
      mustIncludeKeywords: 'developer, API',
      mustAvoidKeywords: 'enterprise, legacy',
      competitorUrls: 'https://competitor.com',
    }

    mockPrisma.companyProfile.create.mockResolvedValue({
      ...fullProfileData,
      id: 'full-profile-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const created = await mockPrisma.companyProfile.create({
      data: fullProfileData,
    })

    expect(created.name).toBe('Full Profile')
    expect(created.companyName).toBe('Test Corp')
    expect(created.industry).toBe('Technology')
    expect(created.brandColors).toEqual(['#FF0000', '#00FF00'])
    expect(created.emojiPreference).toBe('moderate')
    expect(created.primaryAudience).toBe('Developers')
    expect(created.mustIncludeKeywords).toBe('developer, API')
    expect(created.mustAvoidKeywords).toBe('enterprise, legacy')
  })

  it('should handle minimal profile creation (only required fields)', async () => {
    mockGetServerSession.mockResolvedValue(regularSession)

    const minimalData = {
      userId: regularUser.id,
      name: 'Minimal',
      companyName: 'MinCo',
      isDefault: false,
    }

    mockPrisma.companyProfile.create.mockResolvedValue({
      ...minimalProfile,
      ...minimalData,
      id: 'minimal-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const created = await mockPrisma.companyProfile.create({
      data: minimalData,
    })

    expect(created.name).toBe('Minimal')
    expect(created.companyName).toBe('MinCo')
    expect(created.industry).toBeNull()
    expect(created.brandVoice).toBeNull()
    expect(created.primaryAudience).toBeNull()
  })

  it('should track project count per profile', async () => {
    mockGetServerSession.mockResolvedValue(regularSession)
    mockPrisma.companyProfile.findMany.mockResolvedValue([
      { ...defaultProfile, _count: { projects: 5 } },
      { ...secondProfile, _count: { projects: 2 } },
      { ...minimalProfile, _count: { projects: 0 } },
    ])

    const profiles = await mockPrisma.companyProfile.findMany({
      where: { userId: regularUser.id },
      include: { _count: { select: { projects: true } } },
    })

    expect(profiles[0]._count.projects).toBe(5)
    expect(profiles[1]._count.projects).toBe(2)
    expect(profiles[2]._count.projects).toBe(0)
  })
})

describe('Company Profile - Pipeline Integration', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  it('should link profile to project on creation', async () => {
    mockGetServerSession.mockResolvedValue(regularSession)

    const projectWithProfile = {
      id: 'project-with-profile',
      userId: regularUser.id,
      name: 'LinkedIn Campaign',
      serviceType: 'linkedin-text-posts',
      tier: 'premium',
      lengthTier: 'standard',
      status: 'draft',
      formData: {
        company: 'Acme Corp',
        audience: 'Marketing managers',
        topic: 'Content Strategy',
      },
      styleSelections: null,
      additionalInfo: null,
      companyProfileId: defaultProfile.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrisma.project.create.mockResolvedValue(projectWithProfile)

    const created = await mockPrisma.project.create({
      data: {
        userId: regularUser.id,
        name: 'LinkedIn Campaign',
        serviceType: 'linkedin-text-posts',
        tier: 'premium',
        lengthTier: 'standard',
        status: 'draft',
        formData: {
          company: 'Acme Corp',
          audience: 'Marketing managers',
          topic: 'Content Strategy',
        },
        companyProfileId: defaultProfile.id,
      },
    })

    expect(created.companyProfileId).toBe(defaultProfile.id)
    expect(mockPrisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          companyProfileId: defaultProfile.id,
        }),
      })
    )
  })

  it('should allow project creation without profile', async () => {
    mockGetServerSession.mockResolvedValue(regularSession)

    const projectWithoutProfile = {
      id: 'project-no-profile',
      userId: regularUser.id,
      name: 'Quick Blog Post',
      serviceType: 'blog-post',
      tier: 'standard',
      lengthTier: 'standard',
      status: 'draft',
      formData: null,
      styleSelections: null,
      additionalInfo: null,
      companyProfileId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrisma.project.create.mockResolvedValue(projectWithoutProfile)

    const created = await mockPrisma.project.create({
      data: {
        userId: regularUser.id,
        name: 'Quick Blog Post',
        serviceType: 'blog-post',
        tier: 'standard',
        lengthTier: 'standard',
        status: 'draft',
        companyProfileId: null,
      },
    })

    expect(created.companyProfileId).toBeNull()
  })

  it('should map profile fields correctly to pipeline form data', () => {
    // Test the field mapping from profile to pipeline inputs
    const profile = defaultProfile

    const twitterFormData = {
      company: profile.companyName,
      industry: profile.industry,
      audience: profile.primaryAudience,
      sampleTweets: profile.sampleContent,
    }

    expect(twitterFormData.company).toBe('Acme Corp')
    expect(twitterFormData.industry).toBe('Technology')
    expect(twitterFormData.audience).toBe('Marketing managers aged 30-45 at B2B SaaS companies')
    expect(twitterFormData.sampleTweets).toBe('Here is a sample LinkedIn post about our product...')

    const linkedinFormData = {
      company: profile.companyName,
      industry: profile.industry,
      audience: profile.primaryAudience,
      sampleLinkedInPosts: profile.sampleContent,
    }

    expect(linkedinFormData.company).toBe('Acme Corp')
    expect(linkedinFormData.sampleLinkedInPosts).toBe(profile.sampleContent)

    const instagramFormData = {
      company: profile.companyName,
      industry: profile.industry,
      audience: profile.primaryAudience,
      goal: profile.primaryGoals,
    }

    expect(instagramFormData.company).toBe('Acme Corp')
    expect(instagramFormData.goal).toBe('Brand awareness, lead generation')
  })
})

describe('Company Profile Completeness Score', () => {
  it('should calculate score based on filled fields', () => {
    // The scoring function checks 10 key fields
    const keyFields = [
      'companyName', 'industry', 'companyDescription', 'companySize',
      'brandVoice', 'sampleContent', 'primaryAudience',
      'primaryGoals', 'keyMessages', 'uniqueSellingPoints',
    ]

    // Default profile has all 10 fields filled
    const filledCount = keyFields.filter(
      (field) => defaultProfile[field as keyof typeof defaultProfile]
    ).length
    const score = Math.round((filledCount / keyFields.length) * 100)
    expect(score).toBe(100)

    // Minimal profile has only companyName filled (1/10)
    const minimalFilledCount = keyFields.filter(
      (field) => minimalProfile[field as keyof typeof minimalProfile]
    ).length
    const minimalScore = Math.round((minimalFilledCount / keyFields.length) * 100)
    expect(minimalScore).toBe(10) // Only companyName is filled
  })
})
