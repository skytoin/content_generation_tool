import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, ensureUniqueSlug } from '@/lib/blog/slug-utils'

// GET - Public: list published posts with pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const tag = searchParams.get('tag')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { status: 'published' }
  if (tag) {
    where.tags = { contains: tag }
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        featuredImageAlt: true,
        status: true,
        publishedAt: true,
        tags: true,
        author: {
          select: { name: true, image: true },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

// POST - Admin only: create a new blog post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { title, content, excerpt, featuredImage, featuredImageAlt, status, metaTitle, metaDescription, tags } = body

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const slug = await ensureUniqueSlug(body.slug || generateSlug(title))

  const post = await prisma.blogPost.create({
    data: {
      authorId: user.id,
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      featuredImage: featuredImage || null,
      featuredImageAlt: featuredImageAlt || null,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      tags: tags || null,
    },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  return NextResponse.json(post, { status: 201 })
}
