import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, ensureUniqueSlug } from '@/lib/blog/slug-utils'

async function getAdminUser(session: { user?: { email?: string | null } } | null) {
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  })
  return user?.isAdmin ? user : null
}

// GET - Public for published posts, admin for drafts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const bySlug = searchParams.get('bySlug') === 'true'

  const post = await prisma.blogPost.findFirst({
    where: bySlug ? { slug: id } : { id },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (post.status !== 'published') {
    const session = await getServerSession(authOptions)
    const admin = await getAdminUser(session)
    if (!admin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  }

  return NextResponse.json(post)
}

// PATCH - Admin only: update a blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const admin = await getAdminUser(session)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const data: Record<string, unknown> = {}

  if (body.title !== undefined) data.title = body.title
  if (body.excerpt !== undefined) data.excerpt = body.excerpt
  if (body.content !== undefined) data.content = body.content
  if (body.featuredImage !== undefined) data.featuredImage = body.featuredImage
  if (body.featuredImageAlt !== undefined) data.featuredImageAlt = body.featuredImageAlt
  if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle
  if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription
  if (body.tags !== undefined) data.tags = body.tags

  if (body.slug !== undefined && body.slug !== existing.slug) {
    data.slug = await ensureUniqueSlug(body.slug, id)
  }

  if (body.status !== undefined) {
    data.status = body.status
    if (body.status === 'published' && !existing.publishedAt) {
      data.publishedAt = new Date()
    }
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  return NextResponse.json(post)
}

// DELETE - Admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await getAdminUser(session)
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.blogPost.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
