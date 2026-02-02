import { BillingPageWrapper } from '@/components/dashboard/BillingPageWrapper'
import { getCurrentUser } from '@/lib/auth-utils'

export default async function BillingPage() {
  const user = await getCurrentUser()
  const subscriptionTier = user?.subscriptionTier || 'free'

  return <BillingPageWrapper subscriptionTier={subscriptionTier} />
}
