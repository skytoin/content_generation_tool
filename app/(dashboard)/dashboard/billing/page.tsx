import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { getCurrentUser } from '@/lib/auth-utils'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out ContentForge AI',
    features: [
      '2 free projects',
      'Basic AI content generation',
      'Email support',
    ],
    current: true,
    cta: 'Current Plan',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited projects',
      'Advanced AI models',
      'Priority generation',
      'Priority support',
      'Custom style training',
    ],
    current: false,
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom AI training',
    ],
    current: false,
    cta: 'Contact Sales',
  },
]

export default async function BillingPage() {
  const user = await getCurrentUser()
  const subscriptionTier = user?.subscriptionTier || 'free'

  return (
    <>
      <DashboardHeader
        title="Billing & Subscription"
        subtitle="Manage your subscription and payment methods"
      />

      <div className="p-6 lg:p-8">
        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900 capitalize">{subscriptionTier}</p>
              <p className="text-sm text-slate-500 mt-1">
                {subscriptionTier === 'free'
                  ? 'Upgrade to unlock more features'
                  : 'Your subscription renews on the 1st of each month'}
              </p>
            </div>
            {subscriptionTier !== 'free' && (
              <button className="text-sm text-slate-600 hover:text-slate-900 underline">
                Cancel subscription
              </button>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl shadow-sm border-2 p-6 ${
                  plan.popular ? 'border-primary-500' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.current || (plan.name.toLowerCase() === subscriptionTier)}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all ${
                    plan.current || (plan.name.toLowerCase() === subscriptionTier)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : plan.popular
                      ? 'btn-primary'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.name.toLowerCase() === subscriptionTier ? 'Current Plan' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
          </div>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500">No payment history yet</p>
          </div>
        </div>
      </div>
    </>
  )
}
