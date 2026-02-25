import { describe, it, expect } from 'vitest'
import { renderTiptapToHtml } from '@/lib/blog/tiptap-renderer'

describe('renderTiptapToHtml', () => {
  it('should render a simple paragraph', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p>Hello world</p>')
  })

  it('should render headings', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'My Heading' }],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<h2>My Heading</h2>')
  })

  it('should render bold text', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'bold text', marks: [{ type: 'bold' }] },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p><strong>bold text</strong></p>')
  })

  it('should render italic text', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'italic text', marks: [{ type: 'italic' }] },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p><em>italic text</em></p>')
  })

  it('should render links', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'click here',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p><a href="https://example.com">click here</a></p>')
  })

  it('should render images', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/img.jpg', alt: 'test image' },
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<img src="https://example.com/img.jpg" alt="test image" />')
  })

  it('should render bullet lists', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Item 1' }] },
              ],
            },
            {
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Item 2' }] },
              ],
            },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<ul><li><p>Item 1</p></li><li><p>Item 2</p></li></ul>')
  })

  it('should render blockquotes', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'blockquote',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'A quote' }] },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<blockquote><p>A quote</p></blockquote>')
  })

  it('should render code blocks', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { language: 'javascript' },
          content: [{ type: 'text', text: 'const x = 1' }],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<pre><code class="language-javascript">const x = 1</code></pre>')
  })

  it('should render horizontal rules', () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'horizontalRule' }],
    }
    expect(renderTiptapToHtml(doc)).toBe('<hr />')
  })

  it('should handle empty doc', () => {
    expect(renderTiptapToHtml(null)).toBe('')
    expect(renderTiptapToHtml(undefined)).toBe('')
    expect(renderTiptapToHtml({})).toBe('')
  })

  it('should escape HTML in text', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '<script>alert("xss")</script>' }],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>')
  })

  it('should handle nested marks', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'bold and italic',
              marks: [{ type: 'bold' }, { type: 'italic' }],
            },
          ],
        },
      ],
    }
    const html = renderTiptapToHtml(doc)
    expect(html).toContain('<strong>')
    expect(html).toContain('<em>')
    expect(html).toContain('bold and italic')
  })

  it('should handle strikethrough', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'struck', marks: [{ type: 'strike' }] },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p><s>struck</s></p>')
  })

  it('should handle inline code', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'const x', marks: [{ type: 'code' }] },
          ],
        },
      ],
    }
    expect(renderTiptapToHtml(doc)).toBe('<p><code>const x</code></p>')
  })
})
