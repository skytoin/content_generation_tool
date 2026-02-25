import { adminUser } from './users'

export const publishedBlogPost = {
  id: 'blog-post-1',
  authorId: adminUser.id,
  title: 'Getting Started with Content Marketing',
  slug: 'getting-started-with-content-marketing',
  excerpt: 'Learn the fundamentals of content marketing and how to build a strategy that drives results for your business.',
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Why Content Marketing Matters' }],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Content marketing is one of the most ' },
          { type: 'text', text: 'effective strategies', marks: [{ type: 'bold' }] },
          { type: 'text', text: ' for growing your business online.' },
        ],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content is king, but distribution is queen.' }],
          },
        ],
      },
    ],
  },
  featuredImage: 'https://images.unsplash.com/photo-content-marketing',
  featuredImageAlt: 'Content marketing strategy illustration',
  status: 'published',
  publishedAt: new Date('2025-01-15T10:00:00Z'),
  metaTitle: 'Getting Started with Content Marketing | Scribengine Blog',
  metaDescription: 'Learn the fundamentals of content marketing and how to build a strategy that drives results.',
  tags: 'content-marketing,strategy,beginners',
  createdAt: new Date('2025-01-10T08:00:00Z'),
  updatedAt: new Date('2025-01-15T10:00:00Z'),
  author: {
    name: adminUser.name,
    image: adminUser.image,
  },
}

export const draftBlogPost = {
  id: 'blog-post-2',
  authorId: adminUser.id,
  title: 'Advanced SEO Techniques for 2025',
  slug: 'advanced-seo-techniques-2025',
  excerpt: 'Discover cutting-edge SEO strategies.',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Draft content here.' }],
      },
    ],
  },
  featuredImage: null,
  featuredImageAlt: null,
  status: 'draft',
  publishedAt: null,
  metaTitle: null,
  metaDescription: null,
  tags: 'seo,advanced',
  createdAt: new Date('2025-02-01T08:00:00Z'),
  updatedAt: new Date('2025-02-01T08:00:00Z'),
  author: {
    name: adminUser.name,
    image: adminUser.image,
  },
}

export const secondPublishedPost = {
  id: 'blog-post-3',
  authorId: adminUser.id,
  title: 'Social Media Content Calendar Template',
  slug: 'social-media-content-calendar-template',
  excerpt: 'Download our free social media content calendar template to plan your posts.',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Planning your social media content is essential.' }],
      },
    ],
  },
  featuredImage: 'https://images.unsplash.com/photo-social-media',
  featuredImageAlt: 'Social media calendar',
  status: 'published',
  publishedAt: new Date('2025-01-20T14:00:00Z'),
  metaTitle: 'Social Media Content Calendar Template | Scribengine Blog',
  metaDescription: 'Download our free social media content calendar template.',
  tags: 'social-media,templates,planning',
  createdAt: new Date('2025-01-18T08:00:00Z'),
  updatedAt: new Date('2025-01-20T14:00:00Z'),
  author: {
    name: adminUser.name,
    image: adminUser.image,
  },
}
