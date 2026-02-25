import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { renderTiptapToHtml } from '@/lib/blog/tiptap-renderer'
import { InkBlogPost } from '@/components/themes/ink-diffusion/pages'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: 'published' },
    select: { title: true, excerpt: true, metaTitle: true, metaDescription: true, featuredImage: true, publishedAt: true },
  })

  if (!post) return { title: 'Post Not Found' }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || ''

  return {
    title: `${title} | Scribengine Blog`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      ...(post.featuredImage ? { images: [{ url: post.featuredImage }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: 'published' },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  if (!post) notFound()

  const contentHtml = renderTiptapToHtml(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.metaDescription || '',
    image: post.featuredImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name || 'Scribengine Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Scribengine',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InkBlogPost
        post={JSON.parse(JSON.stringify(post))}
        contentHtml={contentHtml}
      />
    </>
  )
}
