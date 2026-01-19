# 🚀 Scribengine - QUICKSTART GUIDE

## Your AI Content Agency in 15 Minutes

This is your complete, production-ready AI content agency. Follow these steps once, and you'll have a business generating passive income.

---

## STEP 1: GET YOUR API KEYS (10 minutes)

You need 3 free accounts:

### 1.1 Stripe (Payment Processing)
1. Go to https://dashboard.stripe.com/register
2. Create account
3. Go to https://dashboard.stripe.com/apikeys
4. Copy your **Secret Key** (sk_test_...) and **Publishable Key** (pk_test_...)

### 1.2 Anthropic (AI Content Generation)
1. Go to https://console.anthropic.com
2. Create account
3. Go to https://console.anthropic.com/account/keys
4. Create new key, copy it (sk-ant-...)

### 1.3 Resend (Email Delivery)
1. Go to https://resend.com
2. Create account
3. Go to https://resend.com/api-keys
4. Create API key, copy it (re_...)

---

## STEP 2: SETUP (3 minutes)

### Option A: Interactive Setup (Recommended)
```bash
cd scribengine
npm install
npm run setup
```
Follow the prompts to enter your API keys.

### Option B: Manual Setup
1. Copy `.env.example` to `.env.local`
2. Fill in all the values with your API keys

---

## STEP 3: TEST LOCALLY (2 minutes)

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see your professional content agency website!

---

## STEP 4: DEPLOY TO VERCEL (5 minutes)

### 4.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Deploy
```bash
vercel
```

Follow the prompts. When asked about settings, accept defaults.

### 4.3 Add Environment Variables
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add all variables from your `.env.local`

### 4.4 Redeploy
```bash
vercel --prod
```

---

## STEP 5: SETUP STRIPE WEBHOOK (2 minutes)

This is **critical** - it's what triggers content generation after payment!

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your URL: `https://your-vercel-url.vercel.app/api/webhook`
4. Click "Select events"
5. Search for and select: `checkout.session.completed`
6. Click "Add endpoint"
7. Copy the "Signing secret" (whsec_...)
8. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`
9. Redeploy: `vercel --prod`

---

## STEP 6: VERIFY EMAIL DOMAIN (Optional but Recommended)

1. Go to https://resend.com/domains
2. Add your domain (e.g., scribengine.com)
3. Add the DNS records they provide
4. Update `FROM_EMAIL` in Vercel to use your domain

---

## 🎉 YOU'RE LIVE!

Your AI content agency is now:
- ✅ Accepting payments
- ✅ Generating content automatically
- ✅ Delivering via email
- ✅ Making money while you sleep

---

## NEXT: GET CUSTOMERS

### Week 1: Foundation
- [ ] Post on LinkedIn about your new service
- [ ] Share in relevant Facebook groups
- [ ] Post on Twitter/X
- [ ] Tell friends and network

### Week 2-4: Content Marketing
- [ ] Write blog posts (use your own service!)
- [ ] Create how-to content
- [ ] Share case studies

### Month 2+: Scale
- [ ] Run Google Ads targeting "content writing service"
- [ ] Partner with agencies
- [ ] Offer affiliate commissions

---

## REVENUE TARGETS

| Week | Orders | Revenue |
|------|--------|---------|
| 1 | 2-5 | $100-400 |
| 2 | 5-10 | $400-800 |
| 4 | 15-20 | $1,000-1,500 |
| 8 | 30-40 | $2,000-3,000 |
| 12 | 50-60 | $3,000-4,500 |

---

## TROUBLESHOOTING

### Payments not working?
- Check Stripe is in test mode for testing
- Verify webhook URL is correct
- Check Vercel logs for errors

### Emails not sending?
- Verify Resend API key is correct
- Check spam folder
- Verify domain if using custom email

### Content not generating?
- Check Anthropic API key is valid
- Check you have API credits
- View Vercel function logs

---

## SUPPORT

Need help? The code is well-documented. Check:
- `README.md` - Full documentation
- `app/api/webhook/route.ts` - Content generation logic
- `app/page.tsx` - Landing page customization

Good luck with your AI content agency! 🚀
