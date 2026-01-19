# Scribengine 🚀

**A fully automated AI content agency that generates $3,000+/month while you sleep.**

Scribengine is a complete, production-ready SaaS application that:
- Sells AI-powered content services (blog posts, social media, emails, SEO reports)
- Handles payments automatically via Stripe
- Generates content automatically using Claude AI
- Delivers products via email without your involvement

## 💰 Revenue Potential

| Service | Price | Orders/Month for $3K |
|---------|-------|---------------------|
| Blog Post Basic | $49 | 62 orders (~2/day) |
| Blog Post Premium | $99 | 31 orders (~1/day) |
| Social Media Pack | $79 | 38 orders |
| Email Sequence | $149 | 21 orders |
| SEO Content Audit | $199 | 16 orders |
| Content Bundle | $399 | 8 orders (~2/week) |

**Realistic mix**: 40-60 orders/month = $3,000-5,000/month

## ⚡ Quick Start (One-Time Setup)

### Prerequisites

You need accounts with these services (all have free tiers to start):

1. **Stripe** - Payment processing
   - Sign up: https://dashboard.stripe.com/register
   - Get API keys: https://dashboard.stripe.com/apikeys

2. **Anthropic** - AI content generation
   - Sign up: https://console.anthropic.com
   - Get API key: https://console.anthropic.com/account/keys

3. **Resend** - Email delivery
   - Sign up: https://resend.com
   - Get API key: https://resend.com/api-keys

### Setup Steps

#### Step 1: Clone and Install

```bash
# Navigate to the project
cd scribengine

# Install dependencies
npm install
```

#### Step 2: Run Setup Script

```bash
npm run setup
```

This interactive script will:
- Collect your API keys
- Create your `.env.local` file
- Guide you through remaining steps

#### Step 3: Set Up Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy the signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`

#### Step 4: Verify Resend Domain

1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain
3. Add DNS records as instructed
4. Wait for verification (usually <5 minutes)

#### Step 5: Deploy

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Then add your environment variables in the Vercel dashboard.

**Option B: Railway**

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy

**Option C: Any Node.js host**

```bash
npm run build
npm start
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic/Claude API key | Yes |
| `RESEND_API_KEY` | Resend API key | Yes |
| `FROM_EMAIL` | Email sender address | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL | Yes |

## 📁 Project Structure

```
scribengine/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts    # Stripe checkout creation
│   │   └── webhook/route.ts     # Payment & content generation
│   ├── services/
│   │   └── [serviceId]/page.tsx # Order forms
│   ├── success/page.tsx         # Post-payment page
│   ├── layout.tsx               # Site layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Styles
├── scripts/
│   └── setup.js                 # Interactive setup
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## 🎯 How It Works

1. **Customer visits your site** → Professional landing page with services
2. **Customer selects a service** → Fills out content brief form
3. **Customer pays** → Stripe handles secure payment
4. **Webhook fires** → Your server receives payment confirmation
5. **AI generates content** → Claude creates professional content based on brief
6. **Email delivery** → Customer receives content automatically
7. **You profit** → Money deposited to your Stripe account

## 💸 Costs

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Hosting | $0-20/mo | Free tier usually sufficient |
| Anthropic API | ~$0.50-2/order | Depends on content length |
| Stripe | 2.9% + $0.30/transaction | Industry standard |
| Resend | $0-20/mo | Free tier: 3,000 emails/month |

**Net margin**: ~85-90% after costs

## 📈 Marketing Strategies

### Organic (Free)

1. **SEO**: Your site is already optimized. Write blog posts using your own service!
2. **LinkedIn**: Share content samples, tips, and case studies
3. **Twitter/X**: Engage with marketing communities
4. **Reddit**: Help in r/marketing, r/content_marketing, r/SEO
5. **Quora**: Answer content marketing questions

### Paid (When Ready)

1. **Google Ads**: Target "content writing service", "blog post writer"
2. **Facebook/Instagram**: Target small business owners
3. **LinkedIn Ads**: Target marketing managers

### Partnerships

1. **Marketing agencies**: White-label your services
2. **Web designers**: Bundle content with website builds
3. **SEO agencies**: Content creation partnership

## 🔒 Security

- All payments processed through Stripe (PCI compliant)
- API keys stored securely in environment variables
- No sensitive data stored in database
- Webhook signature verification

## 📞 Support

If you run into issues:

1. Check that all environment variables are set correctly
2. Verify your Stripe webhook is configured and working
3. Test with Stripe test mode first
4. Check Vercel/host logs for errors

## 📄 License

MIT License - Use this however you want!

---

## 🚀 Ready to Launch?

1. Run `npm run setup`
2. Deploy to Vercel
3. Configure Stripe webhook
4. Start marketing
5. Watch the orders come in!

**Target: First customer within 30 days, $3K/month within 90 days.**

Good luck with your AI content agency! 🎉
