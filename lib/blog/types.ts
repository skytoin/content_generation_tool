export interface BlogPostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  featuredImageAlt: string | null
  status: string
  publishedAt: Date | null
  tags: string | null
  author: {
    name: string | null
    image: string | null
  }
}

export interface BlogPostFull extends BlogPostListItem {
  content: unknown // Tiptap JSON
  metaTitle: string | null
  metaDescription: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateBlogPostInput {
  title: string
  slug?: string
  excerpt?: string
  content?: unknown
  featuredImage?: string
  featuredImageAlt?: string
  status?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string
}

export interface UpdateBlogPostInput {
  title?: string
  slug?: string
  excerpt?: string
  content?: unknown
  featuredImage?: string
  featuredImageAlt?: string
  status?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string
}
