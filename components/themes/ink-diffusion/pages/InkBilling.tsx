'use client'

import { tokens } from '@/components/ui-concepts/ink-diffusion-system/design-tokens'
import { InkDashboardHeader } from '../InkDashboardHeader'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out Scribengine',
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

interface InkBillingProps {
  subscriptionTier: string
}

export function InkBilling({ subscriptionTier }: InkBillingProps) {
  return (
    <>
      <InkDashboardHeader
        title="Billing & Subscription"
        subtitle="Manage your subscription and payment methods"
      />

      <div className="p-6 lg:p-8">
        {/* Current Plan */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.ink[200]}`,
          }}
        >
          <h2
            className="text-lg mb-4"
            style={{
              fontFamily: tokens.fonts.serif,
              fontWeight: 600,
              color: tokens.colors.ink[700],
            }}
          >
            Current Plan
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-2xl capitalize"
                style={{
                  fontFamily: tokens.fonts.serif,
                  fontWeight: 700,
                  color: tokens.colors.ink[700],
                }}
              >
                {subscriptionTier}
              </p>
              <p
                className="text-sm mt-1"
                style={{
                  fontFamily: tokens.fonts.sans,
                  color: tokens.colors.ink[400],
                }}
              >
                {subscriptionTier === 'free'
                  ? 'Upgrade to unlock more features'
                  : 'Your subscription renews on the 1st of each month'}
              </p>
            </div>
            {subscriptionTier !== 'free' && (
              <button
                className="text-sm underline"
                style={{
                  fontFamily: tokens.fonts.sans,
                  color: tokens.colors.ink[500],
                }}
              >
                Cancel subscription
              </button>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="mb-8">
          <h2
            className="text-lg mb-4"
            style={{
              fontFamily: tokens.fonts.serif,
              fontWeight: 600,
              color: tokens.colors.ink[700],
            }}
          >
            Available Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-lg p-6"
                style={{
                  background: tokens.colors.paper.white,
                  border: plan.popular
                    ? `2px solid ${tokens.colors.sage[500]}`
                    : `1px solid ${tokens.colors.ink[200]}`,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        fontFamily: tokens.fonts.sans,
                        background: tokens.colors.sage[500],
                        color: tokens.colors.paper.white,
                      }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3
                    className="text-lg"
                    style={{
                      fontFamily: tokens.fonts.serif,
                      fontWeight: 600,
                      color: tokens.colors.ink[700],
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span
                      className="text-3xl"
                      style={{
                        fontFamily: tokens.fonts.serif,
                        fontWeight: 700,
                        color: tokens.colors.ink[700],
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontFamily: tokens.fonts.sans,
                        color: tokens.colors.ink[400],
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-2"
                    style={{
                      fontFamily: tokens.fonts.sans,
                      color: tokens.colors.ink[400],
                    }}
                  >
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm"
                      style={{
                        fontFamily: tokens.fonts.sans,
                        color: tokens.colors.ink[600],
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={tokens.colors.sage[500]}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.current || plan.name.toLowerCase() === subscriptionTier}
                  className="w-full py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    background:
                      plan.current || plan.name.toLowerCase() === subscriptionTier
                        ? tokens.colors.paper.cream
                        : plan.popular
                        ? tokens.colors.ink[700]
                        : tokens.colors.paper.cream,
                    color:
                      plan.current || plan.name.toLowerCase() === subscriptionTier
                        ? tokens.colors.ink[400]
                        : plan.popular
                        ? tokens.colors.paper.white
                        : tokens.colors.ink[700],
                    border: `1px solid ${tokens.colors.ink[200]}`,
                  }}
                >
                  {plan.name.toLowerCase() === subscriptionTier ? 'Current Plan' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.ink[200]}`,
          }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: `1px solid ${tokens.colors.ink[200]}` }}
          >
            <h2
              className="text-lg"
              style={{
                fontFamily: tokens.fonts.serif,
                fontWeight: 600,
                color: tokens.colors.ink[700],
              }}
            >
              Payment History
            </h2>
          </div>
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: tokens.colors.paper.cream }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke={tokens.colors.ink[400]}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p
              style={{
                fontFamily: tokens.fonts.sans,
                color: tokens.colors.ink[400],
              }}
            >
              No payment history yet
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
