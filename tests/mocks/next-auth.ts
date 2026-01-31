import { vi } from 'vitest'
import { getServerSession } from 'next-auth'

// Type for mocked getServerSession
export const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>

// Helper to create a mock session
export function createMockSession(overrides: {
  user?: {
    id?: string
    email?: string
    name?: string
    image?: string
  }
} = {}) {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
      ...overrides.user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

// Helper to create a mock user from database
export function createMockUser(overrides: {
  id?: string
  email?: string
  name?: string
  isAdmin?: boolean
  createdAt?: Date
} = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: null,
    image: null,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

// Helper to set up authenticated session
export function mockAuthenticatedSession(user?: {
  id?: string
  email?: string
  name?: string
  image?: string
}) {
  mockGetServerSession.mockResolvedValue(createMockSession({ user }))
}

// Helper to set up unauthenticated session
export function mockUnauthenticatedSession() {
  mockGetServerSession.mockResolvedValue(null)
}

export function resetAuthMocks() {
  mockGetServerSession.mockReset()
}
