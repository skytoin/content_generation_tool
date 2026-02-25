'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkInput } from '../primitives/InkInput'
import { InkTextarea } from '../primitives/InkTextarea'
import type { BlogPostFull } from '@/lib/blog/types'

interface InkBlogEditorProps {
  initialPost?: BlogPostFull
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function InkBlogEditor({ initialPost }: InkBlogEditorProps) {
  const router = useRouter()
  const isEditing = !!initialPost

  const [title, setTitle] = useState(initialPost?.title || '')
  const [slug, setSlug] = useState(initialPost?.slug || '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '')
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || '')
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPost?.featuredImageAlt || '')
  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || '')
  const [tags, setTags] = useState(initialPost?.tags || '')
  const [showSeo, setShowSeo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: (initialPost?.content as Record<string, unknown>) || { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class: 'prose-ink outline-none min-h-[300px] p-6',
        style: `font-family: ${tokens.fonts.serif}; color: ${tokens.colors.text.primary};`,
      },
    },
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      setSlug(generateSlug(title))
    }
  }, [title, autoSlug])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setFeaturedImage(data.url)
      }
    } finally {
      setUploading(false)
    }
  }, [])

  const handleEditorImageUpload = useCallback(async () => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleLinkInsert = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run()
  }, [editor])

  const save = async (status: string) => {
    if (!title.trim()) return alert('Title is required')
    setSaving(true)

    try {
      const body = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content: editor?.getJSON(),
        featuredImage: featuredImage || undefined,
        featuredImageAlt: featuredImageAlt || undefined,
        status,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        tags: tags || undefined,
      }

      const url = isEditing ? `/api/blog/${initialPost.id}` : '/api/blog'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push('/dashboard/blog')
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  const ToolbarButton = ({ active, onClick, children, title: btnTitle }: {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={btnTitle}
      className="p-2 rounded-lg transition-colors"
      style={{
        background: active ? tokens.colors.ink[100] : 'transparent',
        color: active ? tokens.colors.ink[700] : tokens.colors.text.muted,
      }}
    >
      {children}
    </button>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-medium"
          style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
        >
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>
        <button
          onClick={() => router.push('/dashboard/blog')}
          className="text-sm"
          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
        >
          Cancel
        </button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Title
          </label>
          <InkInput
            value={title}
            onChange={(v) => setTitle(v)}
            placeholder="Post title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: tokens.colors.text.muted }}>/blog/</span>
            <InkInput
              value={slug}
              onChange={(v) => {
                setSlug(v)
                setAutoSlug(false)
              }}
              placeholder="post-slug"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Featured Image
          </label>
          {featuredImage ? (
            <div className="relative mb-2">
              <img src={featuredImage} alt={featuredImageAlt || ''} className="w-full max-h-64 object-cover rounded-xl" />
              <button
                onClick={() => setFeaturedImage('')}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/90 shadow"
                style={{ color: '#dc2626' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label
              className="flex items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-current"
              style={{ borderColor: tokens.colors.paper.border, color: tokens.colors.text.muted }}
            >
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span className="text-sm">
                {uploading ? 'Uploading...' : 'Click to upload featured image'}
              </span>
            </label>
          )}
          {featuredImage && (
            <InkInput
              value={featuredImageAlt}
              onChange={(v) => setFeaturedImageAlt(v)}
              placeholder="Image alt text..."
            />
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Excerpt
            <span className="ml-2 text-xs font-normal" style={{ color: tokens.colors.text.muted }}>
              {excerpt.length}/300
            </span>
          </label>
          <InkTextarea
            value={excerpt}
            onChange={(v) => setExcerpt(v.slice(0, 300))}
            placeholder="A brief summary of the post..."
            rows={3}
          />
        </div>

        {/* Tiptap Editor */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Content
          </label>
          <InkCard variant="outlined" padding="none">
            {/* Toolbar */}
            {editor && (
              <div
                className="flex flex-wrap items-center gap-1 p-2"
                style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}
              >
                <ToolbarButton
                  active={editor.isActive('bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Bold"
                >
                  <strong className="text-sm">B</strong>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Italic"
                >
                  <em className="text-sm">I</em>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('strike')}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  title="Strikethrough"
                >
                  <span className="text-sm line-through">S</span>
                </ToolbarButton>
                <div className="w-px h-6 mx-1" style={{ background: tokens.colors.paper.border }} />
                <ToolbarButton
                  active={editor.isActive('heading', { level: 2 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  title="Heading 2"
                >
                  <span className="text-sm font-bold">H2</span>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('heading', { level: 3 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  title="Heading 3"
                >
                  <span className="text-sm font-bold">H3</span>
                </ToolbarButton>
                <div className="w-px h-6 mx-1" style={{ background: tokens.colors.paper.border }} />
                <ToolbarButton
                  active={editor.isActive('bulletList')}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('orderedList')}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  title="Ordered List"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
                  </svg>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('blockquote')}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  title="Blockquote"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </ToolbarButton>
                <ToolbarButton
                  active={editor.isActive('codeBlock')}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  title="Code Block"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </ToolbarButton>
                <div className="w-px h-6 mx-1" style={{ background: tokens.colors.paper.border }} />
                <ToolbarButton
                  active={editor.isActive('link')}
                  onClick={handleLinkInsert}
                  title="Link"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </ToolbarButton>
                <ToolbarButton
                  onClick={handleEditorImageUpload}
                  title="Insert Image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  title="Horizontal Rule"
                >
                  <span className="text-sm">—</span>
                </ToolbarButton>
              </div>
            )}

            {/* Editor */}
            <div
              style={{
                minHeight: '300px',
                background: tokens.colors.paper.white,
              }}
            >
              <EditorContent editor={editor} />
            </div>
          </InkCard>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            Tags
            <span className="ml-2 text-xs font-normal" style={{ color: tokens.colors.text.muted }}>
              comma-separated
            </span>
          </label>
          <InkInput
            value={tags}
            onChange={(v) => setTags(v)}
            placeholder="content-marketing, seo, tips"
          />
        </div>

        {/* SEO Section */}
        <div>
          <button
            onClick={() => setShowSeo(!showSeo)}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${showSeo ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            SEO Settings
          </button>

          {showSeo && (
            <div className="mt-4 space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                  Meta Title
                </label>
                <InkInput
                  value={metaTitle}
                  onChange={(v) => setMetaTitle(v)}
                  placeholder="Custom title for search engines..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                  Meta Description
                </label>
                <InkTextarea
                  value={metaDescription}
                  onChange={(v) => setMetaDescription(v)}
                  placeholder="Custom description for search engines..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div
          className="flex items-center justify-end gap-3 pt-6"
          style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}
        >
          <InkButton
            variant="secondary"
            onClick={() => save('draft')}
            loading={saving}
            disabled={saving}
          >
            Save Draft
          </InkButton>
          <InkButton
            onClick={() => save('published')}
            loading={saving}
            disabled={saving}
          >
            {isEditing && initialPost.status === 'published' ? 'Update' : 'Publish'}
          </InkButton>
        </div>
      </div>
    </div>
  )
}
