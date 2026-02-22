/**
 * LinkedIn Platform Knowledge Base
 *
 * Shared LinkedIn platform rules, algorithm insights, and best practices
 * injected into all LinkedIn pipeline agent prompts.
 */

// ============================================
// LINKEDIN PLATFORM RULES
// ============================================

export const LINKEDIN_PLATFORM_RULES = `
## LINKEDIN PLATFORM RULES (MUST FOLLOW)

### CHARACTER LIMITS
- Post body: 3,000 characters (including spaces)
- "See More" cutoff: ~210 characters (THE HOOK ZONE - everything before this MUST be compelling)
- Comment: 1,250 characters
- Article title: 100 characters
- Article body: 110,000 characters
- Poll question: 140 characters
- Poll option: 30 characters each (max 4 options)
- Headline: 220 characters

### FORMATTING RULES
- NO native bold or italic (LinkedIn strips them)
- Unicode bold/italic sparingly (can look spammy)
- Line breaks are your friend - use them generously
- One sentence per line = maximum readability
- Empty lines between sections for visual breathing room
- Numbered lists work well (1. 2. 3.)
- Bullet points: use dashes (-) or arrows (→)

### LINK RULES (CRITICAL)
- NEVER put links in the post body (kills reach by 40-50%)
- ALWAYS put links in the FIRST COMMENT
- First comment should be posted within 30 seconds of the main post
- If you must include a link, use one at most and expect reduced reach

### HASHTAG RULES
- 3-5 hashtags optimal
- ALWAYS place at the END of the post (not inline)
- Mix broad (#Leadership) and niche (#B2BSaaS) hashtags
- No more than 5 - more looks spammy
- Research active hashtags in the target niche

### ALGORITHM KNOWLEDGE (2025)
- Dwell time is #1 signal (longer reads = more reach)
- Comments >> Reactions (comments are 10x more valuable)
- First 90 minutes are CRITICAL for algorithmic pickup
- Post lifecycle: 24 hours for majority of impressions
- Document/carousel posts get 2.5-3x more reach than text-only
- Polls get massive reach due to built-in engagement
- External links reduce reach by 40-50%
- Posts from personal profiles get 5-10x more reach than company pages
- LinkedIn favors "meaningful professional conversations"
- Posting frequency: 3-5x per week optimal (not more)

### CONTENT THAT PERFORMS ON LINKEDIN
1. Personal stories with professional lessons (highest engagement)
2. Contrarian industry takes (drives comments)
3. Frameworks and mental models (high saves)
4. Career/leadership insights (wide appeal)
5. Data-driven observations (credibility)
6. "I was wrong about X" vulnerability posts (authenticity)
7. Behind-the-scenes of business decisions (transparency)

### CONTENT THAT FAILS ON LINKEDIN
1. Generic motivational quotes (oversaturated)
2. "I'm humbled to announce..." (LinkedIn cringe)
3. Engagement bait: "Like if you agree!" (penalized)
4. Humble brags disguised as insights
5. Copy-paste content from other platforms
6. Wall of text with no line breaks
7. Posts with multiple links
8. Overly promotional/salesy content

### AI DETECTION KILLERS (NEVER USE)

BANNED PHRASES:
- "In today's fast-paced world..."
- "It's important to note..."
- "Let me share my thoughts on..."
- "Here are my top X tips..."
- "I'm excited to announce..."
- "In conclusion..."
- "When it comes to..."
- "First and foremost..."
- "That being said..."
- "At the end of the day..."
- "I recently had the opportunity to..."
- "I'm thrilled/delighted/honored to..."
- "In an era where..."
- "Serves as a testament..."
- "Paving the way for..."
- "It goes without saying..."

BANNED WORDS (AI vocabulary tells — always use simpler alternatives):
delve, tapestry, landscape (metaphor), realm, leverage (verb), utilize, harness,
unlock, unleash, embark, foster, facilitate, streamline, orchestrate, underscore,
showcase, spearhead, elucidate, navigate (metaphor), optimize, elevate,
revolutionize, paradigm, synergy, holistic, robust, seamless, cutting-edge,
groundbreaking, transformative, unprecedented, pivotal, plethora, myriad

EXCEPTIONS — these override the banned words list:
1. INDUSTRY TERMS: If a banned word is a genuine technical term for the customer's industry (e.g., "optimize" in SEO, "leverage" in finance), use it in its precise technical context — never as generic filler.
2. CUSTOMER-SPECIFIED WORDS: If the customer explicitly requests specific words (SEO keywords, brand terms, must-include vocabulary), the customer's preference always takes priority. Include those words naturally.

ADDITIONAL RULES:
- Use contractions (it's, don't, can't) — humans almost always contract
- Prefer simple words: "use" not "utilize", "help" not "facilitate", "show" not "showcase"
- Replace "many experts agree" with a named expert. Replace "studies show" with a specific study
`

// ============================================
// LINKEDIN POST STRUCTURE TEMPLATE
// ============================================

export const LINKEDIN_POST_STRUCTURE = `
## ANATOMY OF A HIGH-PERFORMING LINKEDIN POST

### THE HOOK (First 210 characters - before "See More")
This is THE MOST CRITICAL part. The hook determines if anyone reads your post.
- Must create curiosity, surprise, or emotional connection
- Specific > Generic ("I lost $50K" > "I made a mistake")
- Numbers and specifics stop the scroll
- First-person narrative hooks outperform generic advice
- Ask a question that challenges assumptions
- Open a curiosity gap that demands closing

### THE BODY (After "See More")
- One idea per line for readability
- Short sentences (5-12 words ideal)
- Use line breaks generously
- Build tension or provide value progressively
- Include 1-2 pattern interrupts (unexpected turns)
- Use specific examples, not abstract advice
- Show vulnerability where authentic
- End each section with a transition hook

### THE CTA (Last 2-3 lines)
- Ask ONE specific question (not two)
- Make it easy to answer (not "What do you think about the intersection of AI and...")
- Or give a clear action: "Save this for later" / "Share with someone who needs this"
- Never: "Like if you agree" (penalized by algorithm)

### THE FIRST COMMENT (Posted immediately after)
- This is where links go (protects reach)
- Adds context or asks a follow-up question
- Boosts the post in the algorithm
- Should be substantive, not just "Link below!"
`

// ============================================
// TIER-BASED MODEL ASSIGNMENTS
// ============================================

export const LINKEDIN_MODELS = {
  budget: {
    intake: 'gpt-4o-mini',
    research: 'gpt-4o',      // skipped in budget
    voiceLearning: 'gpt-4o', // skipped if no samples
    strategist: 'gpt-4o-mini',
    writer: 'gpt-4o',
    critic: 'gpt-4o',
    polisher: 'gpt-4o'
  },
  standard: {
    intake: 'gpt-4o-mini',
    research: 'gpt-4o',
    voiceLearning: 'gpt-4o',
    strategist: 'gpt-4.1',
    writer: 'gpt-4.1',
    critic: 'claude-sonnet-4-5-20250929',
    polisher: 'claude-sonnet-4-5-20250929'
  },
  premium: {
    intake: 'gpt-4o-mini',
    research: 'claude-sonnet-4-5-20250929',
    voiceLearning: 'claude-sonnet-4-5-20250929',
    strategist: 'claude-sonnet-4-5-20250929',
    writer: 'claude-sonnet-4-5-20250929',
    critic: 'claude-opus-4-5-20251101',
    polisher: 'claude-opus-4-5-20251101'
  }
} as const
