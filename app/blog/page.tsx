import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { InkBlogIndex } from '@/components/themes/ink-diffusion/pages'

export const metadata: Metadata = {
  title: 'Blog | Scribengine',
  description: 'Insights, tips, and strategies for content marketing, SEO, and social media from the Scribengine team.',
  openGraph: {
    title: 'Blog | Scribengine',
    description: 'Insights, tips, and strategies for content marketing, SEO, and social media.',
    type: 'website',
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>
}) {
  const { page: pageParam, tag } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1'))
  const limit = 12
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

  const totalPages = Math.ceil(total / limit)

  return (
    <InkBlogIndex
      posts={JSON.parse(JSON.stringify(posts))}
      currentPage={page}
      totalPages={totalPages}
      currentTag={tag || null}
    />
  )
}
