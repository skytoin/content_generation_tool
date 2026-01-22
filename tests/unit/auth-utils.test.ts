import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetPrismaMocks } from '../mocks/prisma'
import {
  mockGetServerSession,
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
  createMockSession,
  createMockUser,
  resetAuthMocks,
} from '../mocks/next-auth'
import { adminUser, regularUser, adminSession, regularSession } from '../fixtures/users'

// Import after mocks are set up
import {
  getSession,
  getCurrentUser,
  requireAuth,
  requireUserId,
  isCurrentUserAdmin,
  requireAdmin,
} from '@/lib/auth-utils'

describe('auth-utils', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  describe('getSession', () => {
    it('should return session when authenticated', async () => {
      const mockSession = createMockSession()
      mockGetServerSession.mockResolvedValue(mockSession)

      const session = await getSession()
      expect(session).toEqual(mockSession)
    })

    it('should return null when not authenticated', async () => {
      mockUnauthenticatedSession()

      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const user = await getCurrentUser()
      expect(user).toEqual(regularUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: regularUser.email },
      })
    })

    it('should return null when not authenticated', async () => {
      mockUnauthenticatedSession()

      const user = await getCurrentUser()
      expect(user).toBeNull()
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('should return null when session has no email', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'test-id' },
        expires: new Date().toISOString(),
      })

      const user = await getCurrentUser()
      expect(user).toBeNull()
    })

    it('should return admin user correctly', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      const user = await getCurrentUser()
      expect(user).toEqual(adminUser)
      expect(user?.isAdmin).toBe(true)
    })
  })

  describe('requireAuth', () => {
    it('should return session when authenticated', async () => {
      const mockSession = createMockSession()
      mockGetServerSession.mockResolvedValue(mockSession)

      const session = await requireAuth()
      expect(session).toEqual(mockSession)
    })

    it('should redirect when not authenticated', async () => {
      mockUnauthenticatedSession()

      await expect(requireAuth()).rejects.toThrow('REDIRECT:/login')
    })

    it('should redirect when session exists but no user', async () => {
      mockGetServerSession.mockResolvedValue({
        expires: new Date().toISOString(),
      })

      await expect(requireAuth()).rejects.toThrow('REDIRECT:/login')
    })
  })

  describe('requireUserId', () => {
    it('should return user ID from session', async () => {
      const mockSession = createMockSession({ user: { id: 'test-user-id' } })
      mockGetServerSession.mockResolvedValue(mockSession)

      const userId = await requireUserId()
      expect(userId).toBe('test-user-id')
    })

    it('should fetch user ID from database if not in session', async () => {
      const mockSession = {
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'db-user-id' })

      const userId = await requireUserId()
      expect(userId).toBe('db-user-id')
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true },
      })
    })

    it('should redirect if user not found in database', async () => {
      const mockSession = {
        user: { email: 'notfound@example.com' },
        expires: new Date().toISOString(),
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await expect(requireUserId()).rejects.toThrow('REDIRECT:/login')
    })

    it('should redirect when not authenticated', async () => {
      mockUnauthenticatedSession()

      await expect(requireUserId()).rejects.toThrow('REDIRECT:/login')
    })
  })

  describe('isCurrentUserAdmin', () => {
    it('should return true for admin user', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(true)
    })

    it('should return false for regular user', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(false)
    })

    it('should return false when not authenticated', async () => {
      mockUnauthenticatedSession()

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(false)
    })

    it('should return false when user not found', async () => {
      mockAuthenticatedSession()
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(false)
    })
  })

  describe('requireAdmin', () => {
    it('should return admin user when user is admin', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      const user = await requireAdmin()
      expect(user).toEqual(adminUser)
      expect(user.isAdmin).toBe(true)
    })

    it('should throw error for regular user', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })

    it('should throw error when not authenticated', async () => {
      mockUnauthenticatedSession()

      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })

    it('should throw error when user not found', async () => {
      mockAuthenticatedSession()
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })
  })
})

describe('Admin vs Non-Admin Access Control', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  describe('Admin privileges', () => {
    it('admin should have isAdmin flag set to true', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      const user = await getCurrentUser()
      expect(user?.isAdmin).toBe(true)
    })

    it('admin should pass requireAdmin check', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      await expect(requireAdmin()).resolves.toEqual(adminUser)
    })

    it('admin should be identified by isCurrentUserAdmin', async () => {
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(true)
    })
  })

  describe('Non-admin restrictions', () => {
    it('regular user should have isAdmin flag set to false', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const user = await getCurrentUser()
      expect(user?.isAdmin).toBe(false)
    })

    it('regular user should fail requireAdmin check', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })

    it('regular user should not be identified as admin', async () => {
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(false)
    })

    it('unauthenticated user should fail all admin checks', async () => {
      mockUnauthenticatedSession()

      const isAdmin = await isCurrentUserAdmin()
      expect(isAdmin).toBe(false)
      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })
  })

  describe('Access control scenarios', () => {
    it('should differentiate between admin and regular user correctly', async () => {
      // Test admin
      mockAuthenticatedSession({ email: adminUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      expect(await isCurrentUserAdmin()).toBe(true)

      // Reset and test regular user
      resetPrismaMocks()
      resetAuthMocks()
      mockAuthenticatedSession({ email: regularUser.email })
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)
      expect(await isCurrentUserAdmin()).toBe(false)
    })
  })
})
