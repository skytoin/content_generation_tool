# Analytics Tools Setup Guide

This guide provides step-by-step instructions for connecting all analytics tools to Scribengine's Content Architect pipeline.

## Overview

| Tool | Tier | Cost | Status |
|------|------|------|--------|
| Google PageSpeed Insights | Free | Free (25,000 queries/day) | ✅ Ready |
| Google Trends | Free | Requires Third-Party | ⚠️ Needs SerpAPI |
| RiteKit (Hashtags) | Freemium | $49-99/month | ✅ Ready |
| SEMrush | Paid | $449.95/month + API units | 📋 Premium Only |
| SpyFu | Paid | $39-249/month | 📋 Premium Only |
| SparkToro | Paid | API Coming Soon | ❌ Not Available |
| Facebook Ad Library | Free | Free (with verification) | ✅ Ready |

---

## 1. Google PageSpeed Insights API (FREE)

**What it provides:** Website performance analysis, Core Web Vitals, optimization suggestions.

### Step-by-Step Setup

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Scribengine Analytics")
4. Click "Create"

#### Step 2: Enable the API
1. In the left menu, go to **APIs & Services** → **Library**
2. Search for "PageSpeed Insights API"
3. Click on it and press **Enable**

#### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the generated key
4. (Recommended) Click "Restrict Key" → Add HTTP referrer restrictions for security

#### Step 4: Add to Scribengine
Add to your `.env` file:
```bash
GOOGLE_PAGESPEED_API_KEY=your_api_key_here
```

### Rate Limits
- **Without API key:** 60 queries/minute
- **With API key:** 25,000 queries/day (free)

### Testing
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_API_KEY"
```

**Documentation:** [PageSpeed Insights API Docs](https://developers.google.com/speed/docs/insights/v5/get-started)

---

## 2. Google Trends (via SerpAPI)

**What it provides:** Search trend analysis, keyword comparison, related queries, rising topics.

> ⚠️ **Important:** Google does NOT offer an official public Trends API. The official API is in alpha with limited access. We use SerpAPI as a reliable third-party provider.

### Option A: SerpAPI (Recommended)

#### Step 1: Create SerpAPI Account
1. Go to [SerpAPI](https://serpapi.com/)
2. Click "Register" and create an account
3. Verify your email

#### Step 2: Get API Key
1. Log in to your dashboard
2. Your API key is displayed on the main dashboard
3. Copy the API key

#### Step 3: Choose a Plan
| Plan | Price | Searches/Month |
|------|-------|----------------|
| Developer | $75/month | 5,000 |
| Production | $150/month | 15,000 |
| Big Data | $275/month | 30,000 |

#### Step 4: Add to Scribengine
```bash
SERPAPI_API_KEY=your_serpapi_key_here
```

### Option B: Official Google Trends API (Alpha - Limited Access)

1. Apply at [Google Trends API Alpha](https://developers.google.com/search/apis/trends)
2. Wait for approval (very limited spots)
3. If approved, follow their documentation

**SerpAPI Documentation:** [SerpAPI Google Trends](https://serpapi.com/google-trends-api)

---

## 3. RiteKit / RiteTag API (Hashtag Analytics)

**What it provides:** Real-time hashtag suggestions, popularity metrics, engagement predictions.

### Step-by-Step Setup

#### Step 1: Create RiteKit Account
1. Go to [RiteKit](https://ritekit.com/)
2. Click "Sign Up" and create an account
3. Verify your email

#### Step 2: Subscribe to API Plan
1. Go to [RiteKit Pricing](https://ritekit.com/pricing/)
2. Choose an API plan:
   - **50,000 credits/month:** $49/month
   - **100,000 credits/month:** $99/month
3. Complete payment

#### Step 3: Get Client ID
1. Go to your RiteKit dashboard
2. Navigate to **API** section
3. Click "Create a token" or find your **Client ID**
4. Copy the Client ID

#### Step 4: Add to Scribengine
```bash
RITEKIT_CLIENT_ID=your_client_id_here
```

### API Endpoints Available
- `/v1/stats/hashtag-suggestions` - Get hashtag suggestions for text
- `/v1/stats/multiple-hashtags` - Get stats for specific hashtags
- `/v1/search/trending` - Get trending hashtags (if available on plan)

### Rate Limits
- 100 calls per second
- Monthly credits based on plan

**Documentation:** [RiteKit API Docs](https://help.ritekit.com/en/category/ritekit-api-1fgtzum/)

---

## 4. SEMrush API (Premium Feature)

**What it provides:** Comprehensive SEO data, competitor analysis, keyword research, backlink data.

> 💰 **Cost Warning:** SEMrush API requires a Business subscription ($449.95/month) plus API units.

### Step-by-Step Setup

#### Step 1: Get Business Subscription
1. Go to [SEMrush Pricing](https://www.semrush.com/pricing/)
2. Subscribe to the **Business** plan ($449.95/month)
3. This is required for API access

#### Step 2: Get API Key
1. Log in to SEMrush
2. Go to **Settings** → **Subscription Info** → **API Units**
3. Your API key is displayed here
4. Copy the key

#### Step 3: Purchase API Units
API calls consume "units" based on data type:
- Domain Overview: 10-50 units/line
- Keyword Research: 10-100 units/line
- Historical data costs more

#### Step 4: Add to Scribengine
```bash
SEMRUSH_API_KEY=your_api_key_here
```

### Rate Limits
- 10 requests per second per IP
- Monthly unit limit based on purchase

**Documentation:** [SEMrush API Docs](https://developer.semrush.com/api/)

---

## 5. SpyFu API (Premium Feature)

**What it provides:** Competitor keyword research, PPC analysis, ad history, SEO data.

### Step-by-Step Setup

#### Step 1: Subscribe to Pro+ or Team Plan
1. Go to [SpyFu Pricing](https://www.spyfu.com/mainpurchase/?page=default)
2. Choose a plan with API access:
   - **Pro + AI:** $89/month (annual) - Includes $40 API credit
   - **Team/Agency:** $187/month (annual) - Includes $100 API credit

#### Step 2: Get API Credentials
1. Log in to SpyFu
2. Go to **My Account** → **API Usage**
3. Generate or view your API key
4. Copy the key

#### Step 3: Understand Billing
- Billing is per 1,000 rows returned
- $0.50 per 1,000 rows beyond your credit
- Different endpoints have different costs

#### Step 4: Add to Scribengine
```bash
SPYFU_API_KEY=your_api_key_here
```

**Documentation:** [SpyFu Developer Docs](https://developer.spyfu.com/)

---

## 6. SparkToro API (NOT YET AVAILABLE)

**What it provides:** Audience research, influencer discovery, demographic insights.

> ❌ **Status:** SparkToro's public API is "Coming Soon." Currently in beta testing.

### How to Request Access
1. Email **support@sparktoro.com**
2. Request to be added to the API beta list
3. Wait for notification when API launches

### Current Workaround
For now, SparkToro data must be gathered manually through their web interface.

**Website:** [SparkToro](https://sparktoro.com/)

---

## 7. Facebook Ad Library API (FREE)

**What it provides:** Competitor ad research, ad creatives, spend ranges, targeting insights.

### Step-by-Step Setup

#### Step 1: Create Facebook Developer Account
1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click "Get Started" and log in with your Facebook account
3. Complete the registration process

#### Step 2: Create an App
1. Go to [My Apps](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select "None" or "Other" for use case
4. Name your app (e.g., "Scribengine Ad Research")
5. Click "Create App"

#### Step 3: Verify Your Identity (REQUIRED)
1. Go to [Business Verification](https://business.facebook.com/settings/security)
2. Or navigate in your app: **Settings** → **Basic** → **Business Verification**
3. Upload a government-issued ID (driver's license, passport)
4. Wait 1-3 days for verification

> ⚠️ **Important:** Without ID verification, Ad Library API calls will return errors.

#### Step 4: Generate Access Token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant the required permissions (`ads_read`, `ads_archive`)

#### Step 5: Extend Token (Recommended)
Default tokens expire in 1 hour. To extend to 3 months:
1. In Graph API Explorer, click the "i" icon next to your token
2. Click "Open in Access Token Tool"
3. Click "Extend Access Token"
4. Save the new long-lived token

#### Step 6: Add to Scribengine
```bash
FACEBOOK_ACCESS_TOKEN=your_long_lived_token_here
```

### Refreshing Tokens
Tokens expire after ~3 months. Set a reminder to refresh them.

### Rate Limits
- Exact limits not published by Meta
- Expect throttling with heavy usage

**Documentation:** [Meta Ad Library API](https://www.facebook.com/ads/library/api/)

---

## Environment Variables Summary

Add these to your `.env` file:

```bash
# ============================================
# ANALYTICS TOOLS CONFIGURATION
# ============================================

# Google PageSpeed Insights (FREE)
# Get key: https://console.cloud.google.com/
GOOGLE_PAGESPEED_API_KEY=

# Google Trends via SerpAPI ($75-275/month)
# Get key: https://serpapi.com/
SERPAPI_API_KEY=

# RiteKit Hashtag Analytics ($49-99/month)
# Get key: https://ritekit.com/
RITEKIT_CLIENT_ID=

# SEMrush (Business plan required - $449.95/month)
# Get key: https://www.semrush.com/
SEMRUSH_API_KEY=

# SpyFu (Pro+ plan required - $89+/month)
# Get key: https://www.spyfu.com/
SPYFU_API_KEY=

# Facebook Ad Library (FREE - requires ID verification)
# Get token: https://developers.facebook.com/tools/explorer/
FACEBOOK_ACCESS_TOKEN=
```

---

## Tier-Based Tool Availability

### Budget Tier
- Google PageSpeed Insights ✅
- (No other analytics tools)

### Standard Tier
- Google PageSpeed Insights ✅
- Google Trends (via SerpAPI) ✅
- RiteKit Hashtags ✅
- Facebook Ad Library ✅

### Premium Tier
- All Standard tier tools ✅
- SEMrush ✅
- SpyFu ✅
- SparkToro (when available) ⏳

---

## Error Handling

When a tool fails or is unavailable, Scribengine will:

1. **Log the error** to the console with details
2. **Add a warning** to the response
3. **Continue processing** with available tools
4. **Show confidence level** (high/medium/low) based on tools used

### Example Warning Messages
```
⚠️ Google Trends: API key not configured
⚠️ RiteKit: Rate limit exceeded, using cached data
⚠️ SEMrush: Premium feature - upgrade to access
⚠️ Facebook Ad Library: Token expired - please refresh
```

---

## Troubleshooting

### "API key not configured"
- Check your `.env` file has the correct variable name
- Ensure no spaces around the `=` sign
- Restart your development server after changes

### "Rate limit exceeded"
- Wait and retry later
- Consider upgrading your plan
- Implement caching (already built into Scribengine)

### "Token expired" (Facebook)
- Generate a new token in Graph API Explorer
- Extend it to a long-lived token
- Update your `.env` file

### "Authentication failed"
- Verify your API key is correct
- Check if your subscription is active
- Ensure you have the required plan tier

---

## Cost Summary by Usage Level

### Startup/Budget (~$75/month)
- Google PageSpeed: Free
- SerpAPI (Google Trends): $75/month

### Growing Business (~$175/month)
- Above + RiteKit: $49/month
- Total: ~$124/month

### Established/Agency (~$800+/month)
- Above + SEMrush: $449.95/month
- Above + SpyFu: $89/month
- Total: ~$713+/month

---

## Need Help?

- **Scribengine Issues:** Check the console logs for detailed error messages
- **API Provider Support:** Contact each provider's support directly
- **Feature Requests:** Submit via the project's issue tracker
