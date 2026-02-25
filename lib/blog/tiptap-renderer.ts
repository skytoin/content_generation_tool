interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  attrs?: Record<string, unknown>
  marks?: TiptapMark[]
}

interface TiptapMark {
  type: string
  attrs?: Record<string, unknown>
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderMarks(text: string, marks?: TiptapMark[]): string {
  if (!marks || marks.length === 0) return escapeHtml(text)

  let result = escapeHtml(text)
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
      case 'strong':
        result = `<strong>${result}</strong>`
        break
      case 'italic':
      case 'em':
        result = `<em>${result}</em>`
        break
      case 'code':
        result = `<code>${result}</code>`
        break
      case 'strike':
        result = `<s>${result}</s>`
        break
      case 'link': {
        const href = escapeHtml(String(mark.attrs?.href || ''))
        const target = mark.attrs?.target ? ` target="${escapeHtml(String(mark.attrs.target))}"` : ''
        const rel = mark.attrs?.target === '_blank' ? ' rel="noopener noreferrer"' : ''
        result = `<a href="${href}"${target}${rel}>${result}</a>`
        break
      }
    }
  }
  return result
}

function renderNode(node: TiptapNode): string {
  switch (node.type) {
    case 'doc':
      return renderChildren(node)

    case 'paragraph':
      return `<p>${renderChildren(node)}</p>`

    case 'heading': {
      const level = node.attrs?.level || 2
      return `<h${level}>${renderChildren(node)}</h${level}>`
    }

    case 'bulletList':
      return `<ul>${renderChildren(node)}</ul>`

    case 'orderedList':
      return `<ol>${renderChildren(node)}</ol>`

    case 'listItem':
      return `<li>${renderChildren(node)}</li>`

    case 'blockquote':
      return `<blockquote>${renderChildren(node)}</blockquote>`

    case 'codeBlock': {
      const lang = node.attrs?.language ? ` class="language-${escapeHtml(String(node.attrs.language))}"` : ''
      return `<pre><code${lang}>${renderChildren(node)}</code></pre>`
    }

    case 'image': {
      const src = escapeHtml(String(node.attrs?.src || ''))
      const alt = escapeHtml(String(node.attrs?.alt || ''))
      const title = node.attrs?.title ? ` title="${escapeHtml(String(node.attrs.title))}"` : ''
      return `<img src="${src}" alt="${alt}"${title} />`
    }

    case 'horizontalRule':
      return '<hr />'

    case 'hardBreak':
      return '<br />'

    case 'text':
      return renderMarks(node.text || '', node.marks)

    default:
      return renderChildren(node)
  }
}

function renderChildren(node: TiptapNode): string {
  if (!node.content) return ''
  return node.content.map(renderNode).join('')
}

export function renderTiptapToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return ''
  return renderNode(doc as TiptapNode)
}
