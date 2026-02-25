export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function ensureUniqueSlug(
  slug: string,
  excludeId?: string
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')
  let candidate = slug
  let counter = 2

  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })

    if (!existing) return candidate
    candidate = `${slug}-${counter}`
    counter++
  }
}
