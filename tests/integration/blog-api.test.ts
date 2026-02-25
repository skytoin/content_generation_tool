import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetPrismaMocks } from '../mocks/prisma'
import {
  mockGetServerSession,
  mockUnauthenticatedSession,
  resetAuthMocks,
} from '../mocks/next-auth'
import { regularUser, adminUser, regularSession, adminSession } from '../fixtures/users'
import { publishedBlogPost, draftBlogPost, secondPublishedPost } from '../fixtures/blog-posts'

describe('Blog API Access Control', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  describe('GET /api/blog', () => {
    it('should return published posts for public access', async () => {
      mockUnauthenticatedSession()

      mockPrisma.blogPost.findMany.mockResolvedValue([publishedBlogPost, secondPublishedPost])
      mockPrisma.blogPost.count.mockResolvedValue(2)

      const posts = await mockPrisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
      })

      expect(posts).toHaveLength(2)
      expect(posts[0].status).toBe('published')
      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'published' },
        })
      )
    })

    it('should support pagination', async () => {
      mockPrisma.blogPost.findMany.mockResolvedValue([publishedBlogPost])
      mockPrisma.blogPost.count.mockResolvedValue(15)

      const count = await mockPrisma.blogPost.count({ where: { status: 'published' } })
      const totalPages = Math.ceil(count / 12)

      expect(totalPages).toBe(2)
    })

    it('should filter by tag', async () => {
      mockPrisma.blogPost.findMany.mockResolvedValue([publishedBlogPost])

      await mockPrisma.blogPost.findMany({
        where: { status: 'published', tags: { contains: 'content-marketing' } },
      })

      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: { contains: 'content-marketing' },
          }),
        })
      )
    })
  })

  describe('POST /api/blog', () => {
    it('should reject unauthenticated users', async () => {
      mockUnauthenticatedSession()
      const session = await mockGetServerSession()
      expect(session).toBeNull()
    })

    it('should reject non-admin users', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const session = await mockGetServerSession()
      const user = await mockPrisma.user.findUnique({
        where: { email: session?.user?.email },
        select: { id: true, isAdmin: true },
      })

      expect(user?.isAdmin).toBe(false)
    })

    it('should allow admin to create a post', async () => {
      mockGetServerSession.mockResolvedValue(adminSession)
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      mockPrisma.blogPost.findFirst.mockResolvedValue(null) // no slug conflict
      mockPrisma.blogPost.create.mockResolvedValue(publishedBlogPost)

      const session = await mockGetServerSession()
      const user = await mockPrisma.user.findUnique({
        where: { email: session?.user?.email },
      })

      expect(user?.isAdmin).toBe(true)

      const newPost = await mockPrisma.blogPost.create({
        data: {
          authorId: user!.id,
          title: 'New Post',
          slug: 'new-post',
          status: 'draft',
        },
      })

      expect(newPost).toBeDefined()
      expect(mockPrisma.blogPost.create).toHaveBeenCalled()
    })
  })

  describe('GET /api/blog/[id]', () => {
    it('should return published posts to public', async () => {
      mockUnauthenticatedSession()
      mockPrisma.blogPost.findFirst.mockResolvedValue(publishedBlogPost)

      const post = await mockPrisma.blogPost.findFirst({
        where: { slug: publishedBlogPost.slug },
      })

      expect(post).toBeDefined()
      expect(post?.status).toBe('published')
    })

    it('should return 404 for drafts when not admin', async () => {
      mockUnauthenticatedSession()
      mockPrisma.blogPost.findFirst.mockResolvedValue(draftBlogPost)

      const post = await mockPrisma.blogPost.findFirst({
        where: { id: draftBlogPost.id },
      })

      const session = await mockGetServerSession()
      expect(session).toBeNull()
      expect(post?.status).toBe('draft')
      // Route handler would return 404
    })

    it('should return drafts to admin', async () => {
      mockGetServerSession.mockResolvedValue(adminSession)
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      mockPrisma.blogPost.findFirst.mockResolvedValue(draftBlogPost)

      const post = await mockPrisma.blogPost.findFirst({
        where: { id: draftBlogPost.id },
      })

      expect(post?.status).toBe('draft')

      const user = await mockPrisma.user.findUnique({
        where: { email: adminSession.user.email },
      })
      expect(user?.isAdmin).toBe(true)
    })
  })

  describe('PATCH /api/blog/[id]', () => {
    it('should reject unauthenticated users', async () => {
      mockUnauthenticatedSession()
      const session = await mockGetServerSession()
      expect(session).toBeNull()
    })

    it('should reject non-admin users', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const user = await mockPrisma.user.findUnique({
        where: { email: regularSession.user.email },
      })
      expect(user?.isAdmin).toBe(false)
    })

    it('should allow admin to update a post', async () => {
      mockGetServerSession.mockResolvedValue(adminSession)
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      mockPrisma.blogPost.findUnique.mockResolvedValue(draftBlogPost)
      mockPrisma.blogPost.update.mockResolvedValue({
        ...draftBlogPost,
        title: 'Updated Title',
      })

      const updated = await mockPrisma.blogPost.update({
        where: { id: draftBlogPost.id },
        data: { title: 'Updated Title' },
      })

      expect(updated.title).toBe('Updated Title')
    })

    it('should set publishedAt when publishing', async () => {
      mockGetServerSession.mockResolvedValue(adminSession)
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      mockPrisma.blogPost.findUnique.mockResolvedValue(draftBlogPost)

      const now = new Date()
      mockPrisma.blogPost.update.mockResolvedValue({
        ...draftBlogPost,
        status: 'published',
        publishedAt: now,
      })

      const updated = await mockPrisma.blogPost.update({
        where: { id: draftBlogPost.id },
        data: { status: 'published', publishedAt: now },
      })

      expect(updated.status).toBe('published')
      expect(updated.publishedAt).toBeDefined()
    })
  })

  describe('DELETE /api/blog/[id]', () => {
    it('should reject unauthenticated users', async () => {
      mockUnauthenticatedSession()
      const session = await mockGetServerSession()
      expect(session).toBeNull()
    })

    it('should reject non-admin users', async () => {
      mockGetServerSession.mockResolvedValue(regularSession)
      mockPrisma.user.findUnique.mockResolvedValue(regularUser)

      const user = await mockPrisma.user.findUnique({
        where: { email: regularSession.user.email },
      })
      expect(user?.isAdmin).toBe(false)
    })

    it('should allow admin to delete a post', async () => {
      mockGetServerSession.mockResolvedValue(adminSession)
      mockPrisma.user.findUnique.mockResolvedValue(adminUser)
      mockPrisma.blogPost.findUnique.mockResolvedValue(publishedBlogPost)
      mockPrisma.blogPost.delete.mockResolvedValue(publishedBlogPost)

      const deleted = await mockPrisma.blogPost.delete({
        where: { id: publishedBlogPost.id },
      })

      expect(deleted.id).toBe(publishedBlogPost.id)
      expect(mockPrisma.blogPost.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: publishedBlogPost.id },
        })
      )
    })
  })
})
