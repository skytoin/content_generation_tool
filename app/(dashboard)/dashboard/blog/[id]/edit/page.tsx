import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { InkBlogEditor } from '@/components/themes/ink-diffusion/pages'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  if (!post) notFound()

  return <InkBlogEditor initialPost={JSON.parse(JSON.stringify(post))} />
}
