import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const resend = new Resend(process.env.RESEND_API_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Content generation prompts for each service
const contentPrompts: Record<string, (data: any) => string> = {
  'blog-basic': (data) => `You are an expert content writer. Write a comprehensive, SEO-optimized blog post with the following requirements:

Topic: ${data.topic}
Target Keywords: ${data.keywords}
Tone: ${data.tone}
Target Audience: ${data.audience}
Company/Brand: ${data.company}
Industry: ${data.industry}
${data.notes ? `Additional Notes: ${data.notes}` : ''}

Requirements:
- Length: 800-1000 words
- Include an engaging introduction with a hook
- Use H2 subheadings to organize content
- Naturally incorporate the target keywords
- Include actionable tips or insights
- End with a compelling conclusion and call-to-action
- Write in ${data.tone.toLowerCase()} tone appropriate for ${data.audience}

Also provide:
1. A compelling meta description (150-160 characters)
2. 3 alternative headline options

Format the output as:
# [Main Title]

[Article content with proper H2 headings]

---
META DESCRIPTION: [Your meta description]

ALTERNATIVE HEADLINES:
1. [Option 1]
2. [Option 2]
3. [Option 3]`,

  'blog-premium': (data) => `You are an expert content strategist and writer. Create an in-depth, authoritative blog post with the following requirements:

Topic: ${data.topic}
Primary & Secondary Keywords: ${data.keywords}
Tone: ${data.tone}
Target Audience: ${data.audience}
Company/Brand: ${data.company}
Industry: ${data.industry}
${data.competitors ? `Competitor References: ${data.competitors}` : ''}
${data.internalLinks ? `Internal Pages to Link: ${data.internalLinks}` : ''}
${data.notes ? `Additional Notes: ${data.notes}` : ''}

Requirements:
- Length: 1500-2000 words
- Comprehensive coverage of the topic
- Include data, statistics, or research where relevant
- Use H2 and H3 subheadings for clear hierarchy
- Include practical examples and case studies
- Add expert insights and analysis
- Natural keyword integration throughout
- Compelling introduction and conclusion
- Internal linking suggestions marked as [LINK: page description]

Also provide:
1. Meta description (150-160 characters)
2. 5 alternative headline options
3. 3 featured image concepts/prompts
4. Key takeaways summary (3-5 bullet points)

Format appropriately with clear sections.`,

  'social-pack': (data) => `You are a social media strategist. Create a month's worth of engaging social media content:

Company/Brand: ${data.company}
Industry: ${data.industry}
Content Themes: ${data.topics}
Brand Voice: ${data.tone}
Target Audience: ${data.audience}
Primary CTA: ${data.cta}
${data.hashtags ? `Brand Hashtags: ${data.hashtags}` : ''}
${data.notes ? `Additional Context: ${data.notes}` : ''}

Create exactly:
- 10 LinkedIn posts (professional, thought leadership)
- 10 Twitter/X posts (concise, engaging, with trending potential)
- 10 Instagram captions (visual-friendly, with emoji usage)

For each post include:
- The post content
- Relevant hashtags (5-10 per post)
- Best posting time recommendation
- Content type suggestion (image, carousel, video, text)

Format as:

## LINKEDIN POSTS
[10 posts with details]

## TWITTER/X POSTS  
[10 posts with details]

## INSTAGRAM CAPTIONS
[10 captions with details]

## HASHTAG STRATEGY
[Industry hashtags and recommendations]

## CONTENT CALENDAR SUGGESTIONS
[Best days/times to post]`,

  'email-sequence': (data) => `You are an email marketing expert. Create a high-converting 5-email sequence:

Sequence Goal: ${data.goal}
Company/Brand: ${data.company}
Product/Service: ${data.product}
Target Audience: ${data.audience}
Email Tone: ${data.tone}
Primary CTA: ${data.cta}
Customer Pain Points: ${data.painPoints}
${data.notes ? `Additional Context: ${data.notes}` : ''}

Create a 5-email sequence with:
- Strategic timing recommendations between emails
- Multiple subject line options per email (3 each)
- Preview text suggestions
- Clear structure: hook, value, CTA
- Personalization tokens where appropriate

For each email provide:
1. Email purpose/goal
2. Subject line options (3)
3. Preview text
4. Email body (formatted with proper spacing)
5. CTA button text
6. Recommended send timing

Format as:

## EMAIL 1: [Purpose]
**Send: [Timing]**

### Subject Lines:
1. [Option 1]
2. [Option 2]
3. [Option 3]

### Preview Text:
[Preview text]

### Email Body:
[Full email content]

### CTA: [Button text]

---

[Continue for all 5 emails]

## SEQUENCE STRATEGY NOTES
[Overall strategy recommendations, A/B testing suggestions]`,

  'seo-report': (data) => `You are an SEO content strategist. Create a comprehensive content audit and strategy report:

Website: ${data.website}
Company: ${data.company}
Industry: ${data.industry}
Main Competitors: ${data.competitors}
${data.currentKeywords ? `Current Target Keywords: ${data.currentKeywords}` : ''}
Content Goals: ${data.goals}
${data.notes ? `Additional Context: ${data.notes}` : ''}

Create a detailed report including:

## EXECUTIVE SUMMARY
[High-level findings and recommendations]

## CONTENT AUDIT FINDINGS
- Current content strengths
- Content gaps identified
- Opportunities for improvement

## KEYWORD OPPORTUNITY ANALYSIS
[10-15 keyword opportunities with search intent and difficulty assessment]

## COMPETITOR CONTENT ANALYSIS
- What competitors are doing well
- Content gaps you can exploit
- Unique angle opportunities

## RECOMMENDED CONTENT STRATEGY
[10 specific article topics with:]
- Proposed title
- Target keyword(s)
- Search intent
- Recommended word count
- Content format suggestion
- Priority level (High/Medium/Low)

## CONTENT CALENDAR RECOMMENDATIONS
[Suggested publishing frequency and content mix]

## TECHNICAL SEO CONTENT RECOMMENDATIONS
- Internal linking opportunities
- Content structure improvements
- Meta optimization suggestions

## NEXT STEPS
[Prioritized action items]`,

  'content-bundle': (data) => `You are a content marketing director. Create a comprehensive monthly content package:

Company: ${data.company}
Website: ${data.website}
Industry: ${data.industry}
Target Audience: ${data.audience}
Brand Voice: ${data.tone}
Blog Topics: ${data.blogTopics}
Social Media Themes: ${data.socialThemes}
Email Sequence Goal: ${data.emailGoal}
${data.notes ? `Additional Context: ${data.notes}` : ''}

Create the complete package:

# CONTENT PACKAGE FOR ${data.company.toUpperCase()}

## PART 1: BLOG POSTS (4 Articles)

[For each of the 4 blog topics, write a complete 1500-2000 word article with:
- SEO-optimized title
- Meta description
- Full article content with H2/H3 structure
- Internal linking suggestions
- Featured image prompts]

---

## PART 2: SOCIAL MEDIA PACK (30 Posts)

[10 LinkedIn posts, 10 Twitter posts, 10 Instagram captions - all themed around the content and brand]

---

## PART 3: EMAIL SEQUENCE (5 Emails)

[Complete 5-email sequence based on the stated goal]

---

## PART 4: CONTENT CALENDAR

[Monthly calendar showing when to publish each piece, with strategic timing]

---

## PART 5: PERFORMANCE TRACKING RECOMMENDATIONS

[KPIs to track, tools to use, optimization suggestions]`
}

async function generateContent(serviceId: string, formData: any): Promise<string> {
  const prompt = contentPrompts[serviceId]
  if (!prompt) {
    throw new Error('Unknown service type')
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: prompt(formData)
      }
    ]
  })

  const textContent = message.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  return textContent.text
}

async function sendDeliveryEmail(email: string, serviceName: string, content: string, orderId: string) {
  const fromEmail = process.env.FROM_EMAIL || 'orders@contentforge.ai'
  
  await resend.emails.send({
    from: `ContentForge AI <${fromEmail}>`,
    to: email,
    subject: `Your ${serviceName} is Ready! - Order #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
            .content-box { background: #f8fafc; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .content { white-space: pre-wrap; font-family: 'Georgia', serif; line-height: 1.8; }
            .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 14px; }
            .cta { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #d946ef); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ContentForge<span style="color: #0ea5e9;">AI</span></div>
            </div>
            
            <h1 style="color: #0f172a;">Your Content is Ready! 🎉</h1>
            
            <p>Great news! Your <strong>${serviceName}</strong> order has been completed.</p>
            
            <p><strong>Order ID:</strong> ${orderId}</p>
            
            <div class="content-box">
              <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
            </div>
            
            <h3>Need a revision?</h3>
            <p>You have 1 free revision within 7 days. Simply reply to this email with your feedback and we'll make the changes.</p>
            
            <h3>Love the content?</h3>
            <p>We'd love to help with your next project!</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/#services" class="cta">Order More Content</a>
            
            <div class="footer">
              <p>Thank you for choosing ContentForge AI!</p>
              <p>Questions? Reply to this email anytime.</p>
              <p style="margin-top: 20px; color: #cbd5e1;">© ${new Date().getFullYear()} ContentForge AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { serviceId, email, formData: formDataString } = session.metadata!
    const formData = JSON.parse(formDataString)

    console.log(`Processing order: ${session.id} for ${serviceId}`)

    try {
      // Generate content using AI
      const content = await generateContent(serviceId, formData)

      // Get service name for email
      const serviceNames: Record<string, string> = {
        'blog-basic': 'Blog Post - Basic',
        'blog-premium': 'Blog Post - Premium',
        'social-pack': 'Social Media Pack',
        'email-sequence': 'Email Sequence',
        'seo-report': 'SEO Content Audit',
        'content-bundle': 'Monthly Content Bundle',
      }

      // Send delivery email
      const orderId = session.id.slice(-8).toUpperCase()
      await sendDeliveryEmail(email, serviceNames[serviceId], content, orderId)

      console.log(`Order ${orderId} completed and delivered to ${email}`)
    } catch (error) {
      console.error('Error processing order:', error)
      // In production, you'd want to handle this more gracefully
      // (e.g., queue for retry, notify admin)
    }
  }

  return NextResponse.json({ received: true })
}
