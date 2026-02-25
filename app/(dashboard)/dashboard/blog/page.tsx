import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { InkBlogAdmin } from '@/components/themes/ink-diffusion/pages'

export default async function BlogAdminPage() {
  await requireAdmin()

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true } },
    },
  })

  return <InkBlogAdmin posts={JSON.parse(JSON.stringify(posts))} />
}
