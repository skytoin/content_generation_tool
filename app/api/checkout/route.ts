import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const services: Record<string, { name: string; price: number }> = {
  'blog-basic': { name: 'Blog Post - Basic', price: 4900 },
  'blog-premium': { name: 'Blog Post - Premium', price: 9900 },
  'social-pack': { name: 'Social Media Pack', price: 7900 },
  'email-sequence': { name: 'Email Sequence', price: 14900 },
  'seo-report': { name: 'SEO Content Audit', price: 19900 },
  'content-bundle': { name: 'Monthly Content Bundle', price: 39900 },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, email, formData } = body

    const service = services[serviceId]
    if (!service) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: `Scribengine - ${service.name}`,
            },
            unit_amount: service.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${serviceId}`,
      metadata: {
        serviceId,
        email,
        formData: JSON.stringify(formData),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
