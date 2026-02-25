import { requireAdmin } from '@/lib/auth-utils'
import { InkBlogEditor } from '@/components/themes/ink-diffusion/pages'

export default async function NewBlogPostPage() {
  await requireAdmin()
  return <InkBlogEditor />
}
