// ============================================
// COMPLETE STYLE OPTIONS SCHEMA WITH HINTS
// ============================================

export interface StyleOption {
  id: string
  label: string
  hint: string
  options: { value: string; label: string; hint?: string }[]
}

export interface StyleCategory {
  id: string
  name: string
  description: string
  options: StyleOption[]
}

// ============================================
// 1. TONE OF VOICE
// ============================================
export const toneOfVoice: StyleCategory = {
  id: 'tone_of_voice',
  name: 'Tone of Voice',
  description: 'How your content should sound and feel to readers',
  options: [
    {
      id: 'professional_level',
      label: 'Professional Level',
      hint: 'How formal should the language be? Match this to your brand and audience expectations.',
      options: [
        { value: 'corporate_formal', label: 'Corporate Formal', hint: 'Polished, executive-level language. Best for enterprise B2B, legal, finance.' },
        { value: 'business_professional', label: 'Business Professional', hint: 'Professional but approachable. Best for most B2B content.' },
        { value: 'smart_casual', label: 'Smart Casual', hint: 'Relaxed professional. Good for tech companies, startups.' },
        { value: 'approachable_expert', label: 'Approachable Expert', hint: 'Knowledgeable but friendly. Great for thought leadership.' },
        { value: 'friendly_professional', label: 'Friendly Professional', hint: 'Warm and welcoming while still credible. Good for B2C, service businesses.' }
      ]
    },
    {
      id: 'energy_level',
      label: 'Energy Level',
      hint: 'The pace and intensity of your content. High energy creates excitement, calm builds trust.',
      options: [
        { value: 'calm_reassuring', label: 'Calm & Reassuring', hint: 'Steady, trustworthy. Good for healthcare, finance, sensitive topics.' },
        { value: 'balanced_steady', label: 'Balanced & Steady', hint: 'Even-keeled, reliable. Works for most professional content.' },
        { value: 'energetic_enthusiastic', label: 'Energetic & Enthusiastic', hint: 'Upbeat, positive. Great for launches, marketing, consumer brands.' },
        { value: 'bold_confident', label: 'Bold & Confident', hint: 'Strong, assertive. Good for thought leadership, challenger brands.' },
        { value: 'urgent_action', label: 'Urgent & Action-Oriented', hint: 'Creates momentum. Best for sales pages, limited offers, CTAs.' }
      ]
    },
    {
      id: 'personality',
      label: 'Personality',
      hint: 'The character that comes through in your writing. This shapes how readers relate to your brand.',
      options: [
        { value: 'authoritative_leader', label: 'Authoritative Leader', hint: 'Commands respect, sets direction. For market leaders, experts.' },
        { value: 'helpful_mentor', label: 'Helpful Mentor', hint: 'Guides and teaches. Great for educational content, how-to guides.' },
        { value: 'trusted_advisor', label: 'Trusted Advisor', hint: 'Consultative, balanced. For professional services, B2B.' },
        { value: 'innovative_disruptor', label: 'Innovative Disruptor', hint: 'Challenges norms, forward-thinking. For tech, startups.' },
        { value: 'relatable_friend', label: 'Relatable Friend', hint: 'Peer-level, understanding. For consumer brands, community building.' },
        { value: 'wise_teacher', label: 'Wise Teacher', hint: 'Patient, knowledgeable. For complex topics, education.' },
        { value: 'passionate_advocate', label: 'Passionate Advocate', hint: 'Enthusiastic believer. For causes, missions, brand evangelism.' }
      ]
    },
    {
      id: 'emotional_tone',
      label: 'Emotional Tone',
      hint: 'The underlying emotional current in your content.',
      options: [
        { value: 'empathetic', label: 'Empathetic & Understanding', hint: 'Shows you understand reader struggles. Great for problem-solution content.' },
        { value: 'inspiring', label: 'Inspiring & Motivational', hint: 'Lifts readers up, creates possibility. For vision pieces, brand stories.' },
        { value: 'thought_provoking', label: 'Thought-Provoking', hint: 'Challenges assumptions, sparks reflection. For thought leadership.' },
        { value: 'humorous_witty', label: 'Humorous & Witty', hint: 'Light, entertaining. Use carefully - not for all audiences.' },
        { value: 'serious_straightforward', label: 'Serious & Straightforward', hint: 'No-nonsense, direct. For technical, compliance, serious topics.' },
        { value: 'optimistic', label: 'Optimistic & Hopeful', hint: 'Positive outlook, solutions-focused. For most marketing content.' },
        { value: 'realistic', label: 'Realistic & Grounded', hint: 'Honest, practical. Builds trust through authenticity.' }
      ]
    }
  ]
}

// ============================================
// 2. WRITING STYLE
// ============================================
export const writingStyle: StyleCategory = {
  id: 'writing_style',
  name: 'Writing Style',
  description: 'The structural and stylistic approach to your content',
  options: [
    {
      id: 'narrative_approach',
      label: 'Narrative Approach',
      hint: 'How the content is fundamentally structured and presented.',
      options: [
        { value: 'storytelling', label: 'Storytelling', hint: 'Opens with story, weaves narrative throughout. Highly engaging, memorable.' },
        { value: 'data_driven', label: 'Data-Driven', hint: 'Leads with statistics, evidence-first approach. Builds credibility.' },
        { value: 'conversational', label: 'Conversational', hint: 'Like talking to a friend. Easy to read, builds connection.' },
        { value: 'journalistic', label: 'Journalistic', hint: 'Who, what, when, where, why. Objective, fact-based.' },
        { value: 'academic', label: 'Academic', hint: 'Thesis, evidence, conclusion. For research-heavy, authoritative pieces.' },
        { value: 'editorial_opinion', label: 'Editorial/Opinion', hint: 'Strong point of view. For thought leadership, takes.' }
      ]
    },
    {
      id: 'structure_style',
      label: 'Structure Style',
      hint: 'The format and organization of your content.',
      options: [
        { value: 'listicle', label: 'Listicle', hint: '"7 Ways to..." - Scannable, shareable, great for SEO.' },
        { value: 'how_to_guide', label: 'How-To Guide', hint: 'Step-by-step instructions. High utility, great for tutorials.' },
        { value: 'problem_solution', label: 'Problem → Solution', hint: 'Agitate pain, present fix. Classic marketing structure.' },
        { value: 'myth_vs_reality', label: 'Myth vs Reality', hint: 'Debunk misconceptions. Engaging, educational.' },
        { value: 'before_after', label: 'Before & After', hint: 'Show transformation. Great for case studies, testimonials.' },
        { value: 'comparison', label: 'Comparison/Versus', hint: 'Compare options side-by-side. Good for decision-stage content.' },
        { value: 'deep_dive', label: 'Deep Dive Analysis', hint: 'Comprehensive exploration. For cornerstone/pillar content.' },
        { value: 'quick_overview', label: 'Quick Overview', hint: 'Brief summary. For busy readers, introductions.' },
        { value: 'faq', label: 'FAQ Format', hint: 'Question and answer. Great for SEO, voice search.' },
        { value: 'interview_qa', label: 'Interview Style (Q&A)', hint: 'Conversation format. Engaging, personal.' }
      ]
    },
    {
      id: 'sentence_style',
      label: 'Sentence Style',
      hint: 'The rhythm and flow of individual sentences.',
      options: [
        { value: 'short_punchy', label: 'Short & Punchy', hint: 'Hemingway-style. Impactful. Easy to read. Great for mobile.' },
        { value: 'flowing_eloquent', label: 'Flowing & Eloquent', hint: 'Literary, elegant prose. For premium brands, thoughtful readers.' },
        { value: 'mixed_variety', label: 'Mixed Variety', hint: 'Dynamic rhythm. Short sentences for impact, longer for explanation.' },
        { value: 'question_heavy', label: 'Question-Heavy', hint: 'Engages reader thinking. Good for persuasive content.' },
        { value: 'direct_declarative', label: 'Direct & Declarative', hint: 'Clear statements. No fluff. For technical, professional content.' }
      ]
    }
  ]
}

// ============================================
// 3. AUDIENCE SOPHISTICATION
// ============================================
export const audienceSophistication: StyleCategory = {
  id: 'audience_sophistication',
  name: 'Audience Sophistication',
  description: 'Match content complexity to your reader\'s level',
  options: [
    {
      id: 'knowledge_level',
      label: 'Knowledge Level',
      hint: 'How much does your audience already know about this topic?',
      options: [
        { value: 'complete_beginner', label: 'Complete Beginner', hint: 'Explain everything from scratch. No assumed knowledge.' },
        { value: 'some_familiarity', label: 'Some Familiarity', hint: 'Knows basics, needs guidance. Skip 101, start at 201.' },
        { value: 'intermediate', label: 'Intermediate', hint: 'Solid foundation. Focus on nuance and advanced tips.' },
        { value: 'advanced_practitioner', label: 'Advanced Practitioner', hint: 'Peer-to-peer. Assume competence, share expert insights.' },
        { value: 'expert_specialist', label: 'Expert/Specialist', hint: 'Deep technical detail welcome. Speak as equals.' }
      ]
    },
    {
      id: 'reading_level',
      label: 'Reading Level',
      hint: 'The vocabulary and sentence complexity. Lower = more accessible.',
      options: [
        { value: 'simple_8th_grade', label: 'Simple (8th Grade)', hint: 'Anyone can understand. Short sentences, common words.' },
        { value: 'standard_high_school', label: 'Standard (High School)', hint: 'General audience. Clear but not oversimplified.' },
        { value: 'advanced_college', label: 'Advanced (College)', hint: 'Educated readers. Sophisticated vocabulary acceptable.' },
        { value: 'technical_academic', label: 'Technical/Academic', hint: 'Professionals only. Technical terms, complex sentences OK.' }
      ]
    },
    {
      id: 'time_availability',
      label: 'Reader Time Availability',
      hint: 'How much time will your readers invest? This affects depth and structure.',
      options: [
        { value: 'skimmers', label: 'Skimmers', hint: 'Busy readers. Need key takeaways immediately. Use headers, bullets, bold.' },
        { value: 'moderate_readers', label: 'Moderate Readers', hint: '5-7 minute read. Balance depth with accessibility.' },
        { value: 'deep_readers', label: 'Deep Readers', hint: 'Want comprehensive understanding. Can handle long-form.' },
        { value: 'researchers', label: 'Researchers', hint: 'Want everything + sources. Thoroughness valued over brevity.' }
      ]
    }
  ]
}

// ============================================
// 4. CONTENT DEPTH
// ============================================
export const contentDepth: StyleCategory = {
  id: 'content_depth',
  name: 'Content Depth',
  description: 'How comprehensive and detailed the content should be',
  options: [
    {
      id: 'depth',
      label: 'Overall Depth',
      hint: 'How deeply should the content explore the topic?',
      options: [
        { value: 'surface_overview', label: 'Surface Overview', hint: 'Key points only. Introduction to a topic.' },
        { value: 'moderate_depth', label: 'Moderate Depth', hint: 'Explain with examples. Standard blog post depth.' },
        { value: 'comprehensive', label: 'Comprehensive', hint: 'Cover all angles. Pillar content, guides.' },
        { value: 'exhaustive_deep_dive', label: 'Exhaustive Deep Dive', hint: 'Definitive guide. Leave nothing out.' }
      ]
    },
    {
      id: 'detail_level',
      label: 'Detail Level',
      hint: 'Strategic overview vs tactical implementation details.',
      options: [
        { value: 'high_level_strategic', label: 'High-Level Strategic', hint: 'Big picture, concepts, strategy. For executives, decision-makers.' },
        { value: 'tactical_practical', label: 'Tactical & Practical', hint: 'Actionable advice, practical tips. For practitioners.' },
        { value: 'step_by_step_detailed', label: 'Step-by-Step Detailed', hint: 'Specific instructions. For implementation, tutorials.' },
        { value: 'technical_implementation', label: 'Technical Implementation', hint: 'Code-level, specs, technical details. For developers, specialists.' }
      ]
    },
    {
      id: 'example_density',
      label: 'Example Density',
      hint: 'How many concrete examples to include. Examples increase length but improve understanding.',
      options: [
        { value: 'minimal', label: 'Minimal (1-2 examples)', hint: 'Conceptual focus. Examples only where essential.' },
        { value: 'moderate', label: 'Moderate (example per section)', hint: 'Balanced. Illustrate key points.' },
        { value: 'heavy', label: 'Heavy (multiple throughout)', hint: 'Example-rich. Show, don\'t just tell.' },
        { value: 'case_study_focused', label: 'Case Study Focused', hint: 'Built around real examples. Proof-heavy.' }
      ]
    }
  ]
}

// ============================================
// 5. BRAND PERSONALITY
// ============================================
export const brandPersonality: StyleCategory = {
  id: 'brand_personality',
  name: 'Brand Personality',
  description: 'The character and positioning of your brand',
  options: [
    {
      id: 'archetype',
      label: 'Brand Archetype',
      hint: 'Classic brand personality types. Choose the one that best represents your brand\'s character.',
      options: [
        { value: 'sage', label: 'The Sage', hint: 'Wise, knowledgeable, trusted source of truth. (Google, BBC, McKinsey)' },
        { value: 'hero', label: 'The Hero', hint: 'Bold, achievement-focused, overcoming challenges. (Nike, FedEx, BMW)' },
        { value: 'creator', label: 'The Creator', hint: 'Innovative, imaginative, building new things. (Apple, Adobe, Lego)' },
        { value: 'caregiver', label: 'The Caregiver', hint: 'Nurturing, supportive, protecting others. (Johnson & Johnson, UNICEF)' },
        { value: 'explorer', label: 'The Explorer', hint: 'Adventurous, pioneering, discovering. (Jeep, Patagonia, NASA)' },
        { value: 'rebel', label: 'The Rebel', hint: 'Disruptive, challenging status quo. (Harley-Davidson, Virgin, Diesel)' },
        { value: 'magician', label: 'The Magician', hint: 'Transformative, visionary, making dreams reality. (Disney, Tesla)' },
        { value: 'everyman', label: 'The Everyman', hint: 'Relatable, down-to-earth, belonging. (IKEA, Target, Budweiser)' },
        { value: 'ruler', label: 'The Ruler', hint: 'Premium, authoritative, leading. (Mercedes, Rolex, Microsoft)' },
        { value: 'jester', label: 'The Jester', hint: 'Fun, playful, entertaining. (Old Spice, M&Ms, Dollar Shave Club)' },
        { value: 'lover', label: 'The Lover', hint: 'Passionate, emotional connection. (Victoria\'s Secret, Godiva, Chanel)' },
        { value: 'innocent', label: 'The Innocent', hint: 'Optimistic, simple, honest. (Coca-Cola, Dove, Whole Foods)' }
      ]
    },
    {
      id: 'positioning',
      label: 'Market Positioning',
      hint: 'How you position against competitors. This affects confidence level and claims.',
      options: [
        { value: 'market_leader', label: 'Market Leader', hint: '"We set the standard." Confident, authoritative.' },
        { value: 'challenger', label: 'Challenger', hint: '"We do it differently." Bold, contrarian.' },
        { value: 'specialist', label: 'Specialist', hint: '"We\'re the experts in X." Niche authority.' },
        { value: 'innovator', label: 'Innovator', hint: '"We\'re ahead of the curve." Forward-thinking.' },
        { value: 'value_provider', label: 'Value Provider', hint: '"Quality at fair price." Practical, trustworthy.' },
        { value: 'premium_luxury', label: 'Premium/Luxury', hint: '"Best of the best." Exclusive, aspirational.' },
        { value: 'accessible', label: 'Accessible', hint: '"For everyone." Inclusive, welcoming.' }
      ]
    }
  ]
}

// ============================================
// 6. EMOTIONAL APPEAL
// ============================================
export const emotionalAppeal: StyleCategory = {
  id: 'emotional_appeal',
  name: 'Emotional Appeal',
  description: 'The psychological triggers and motivations to leverage',
  options: [
    {
      id: 'primary_appeal',
      label: 'Primary Appeal',
      hint: 'The main psychological lever your content will pull.',
      options: [
        { value: 'logic_facts', label: 'Logic & Facts', hint: 'Convince with data, evidence, rational arguments. For analytical audiences.' },
        { value: 'emotion_story', label: 'Emotion & Story', hint: 'Connect through feelings, narrative. For consumer, B2C.' },
        { value: 'fomo_urgency', label: 'Fear of Missing Out', hint: 'Create urgency, scarcity. For sales, promotions.' },
        { value: 'aspiration_dreams', label: 'Aspiration & Dreams', hint: 'Paint the possibility. For premium, lifestyle brands.' },
        { value: 'pain_problem', label: 'Pain & Problem', hint: 'Agitate the problem, then solve. Classic direct response.' },
        { value: 'social_proof', label: 'Social Proof', hint: '"Others are doing it." Testimonials, case studies, numbers.' },
        { value: 'authority_expertise', label: 'Authority & Expertise', hint: '"Trust the experts." Credentials, research, endorsements.' },
        { value: 'curiosity_intrigue', label: 'Curiosity & Intrigue', hint: 'Make them want to know more. For click-worthy content.' }
      ]
    },
    {
      id: 'motivation_focus',
      label: 'Motivation Focus',
      hint: 'What fundamental motivation are you appealing to?',
      options: [
        { value: 'gain_pleasure', label: 'Gain Pleasure', hint: 'Positive outcomes, benefits, rewards. Optimistic framing.' },
        { value: 'avoid_pain', label: 'Avoid Pain', hint: 'Prevent problems, reduce risk. Fear-based (use carefully).' },
        { value: 'save_time', label: 'Save Time', hint: 'Efficiency, speed, convenience. Universal motivator.' },
        { value: 'save_money', label: 'Save Money', hint: 'Cost savings, value, ROI. For price-conscious audiences.' },
        { value: 'make_money', label: 'Make Money', hint: 'Revenue, growth, profit. For B2B, entrepreneurs.' },
        { value: 'gain_status', label: 'Gain Status', hint: 'Recognition, prestige, advancement. For ambitious audiences.' },
        { value: 'reduce_risk', label: 'Reduce Risk', hint: 'Safety, security, certainty. For risk-averse audiences.' },
        { value: 'simplify_life', label: 'Simplify Life', hint: 'Ease, clarity, reduced complexity. Universal appeal.' }
      ]
    }
  ]
}

// ============================================
// 7. PERSPECTIVE & VOICE
// ============================================
export const perspectiveVoice: StyleCategory = {
  id: 'perspective_voice',
  name: 'Perspective & Voice',
  description: 'The point of view and persona behind the content',
  options: [
    {
      id: 'point_of_view',
      label: 'Point of View',
      hint: 'The grammatical perspective. Affects how personal/direct the content feels.',
      options: [
        { value: 'first_person_singular', label: 'First Person Singular ("I")', hint: 'Personal, individual voice. For personal brands, opinions.' },
        { value: 'first_person_plural', label: 'First Person Plural ("We")', hint: 'Company voice. Most common for brand content.' },
        { value: 'second_person', label: 'Second Person ("You")', hint: 'Direct address. Engaging, reader-focused.' },
        { value: 'third_person', label: 'Third Person ("They/The company")', hint: 'Objective, journalistic. For news, reports.' },
        { value: 'mixed_we_you', label: 'Mixed (We + You)', hint: 'Conversational between brand and reader. Very engaging.' }
      ]
    },
    {
      id: 'author_persona',
      label: 'Author Persona',
      hint: 'Who is "speaking" in this content?',
      options: [
        { value: 'anonymous_brand', label: 'Anonymous Brand Voice', hint: 'The company speaks, no individual named. Standard corporate.' },
        { value: 'named_expert', label: 'Named Expert/Author', hint: 'Bylined content. Builds personal authority.' },
        { value: 'team_collective', label: 'Team/Collective Voice', hint: '"Our team believes..." Humanizes without individual.' },
        { value: 'customer_perspective', label: 'Customer Perspective', hint: 'Written from customer viewpoint. For testimonials, stories.' },
        { value: 'industry_observer', label: 'Industry Observer', hint: 'Neutral analyst perspective. For research, reports.' }
      ]
    }
  ]
}

// ============================================
// 8. CONTENT PURPOSE
// ============================================
export const contentPurpose: StyleCategory = {
  id: 'content_purpose',
  name: 'Content Purpose',
  description: 'The strategic goal and funnel position of this content',
  options: [
    {
      id: 'primary_goal',
      label: 'Primary Goal',
      hint: 'What is this content primarily meant to achieve?',
      options: [
        { value: 'educate', label: 'Educate', hint: 'Teach something new. Build authority, help readers.' },
        { value: 'persuade', label: 'Persuade', hint: 'Change minds or behavior. For opinions, calls to action.' },
        { value: 'convert', label: 'Convert', hint: 'Drive specific action (sign up, buy). Sales-focused.' },
        { value: 'entertain', label: 'Entertain', hint: 'Engage and delight. For brand affinity, sharing.' },
        { value: 'inspire', label: 'Inspire', hint: 'Motivate action or belief. For vision, mission content.' },
        { value: 'inform', label: 'Inform', hint: 'Share news or updates. Factual, timely.' },
        { value: 'build_trust', label: 'Build Trust', hint: 'Establish credibility. For new audiences, skeptics.' },
        { value: 'generate_leads', label: 'Generate Leads', hint: 'Capture interest for follow-up. Gated content, CTAs.' },
        { value: 'nurture', label: 'Nurture', hint: 'Move prospects through funnel. Email sequences, drip.' },
        { value: 'retain', label: 'Retain', hint: 'Keep existing customers engaged. For loyalty, upsell.' }
      ]
    },
    {
      id: 'funnel_stage',
      label: 'Funnel Stage',
      hint: 'Where in the buyer journey is your reader?',
      options: [
        { value: 'awareness', label: 'Awareness', hint: 'Don\'t know they have a problem yet. Educational, broad.' },
        { value: 'consideration', label: 'Consideration', hint: 'Researching solutions. Comparison, guides.' },
        { value: 'decision', label: 'Decision', hint: 'Comparing options, ready to choose. Proof, differentiation.' },
        { value: 'purchase', label: 'Purchase', hint: 'Ready to buy. Remove friction, reassure.' },
        { value: 'retention', label: 'Retention', hint: 'Already a customer. Maximize value, loyalty.' },
        { value: 'advocacy', label: 'Advocacy', hint: 'Turn into promoters. Referrals, reviews, sharing.' }
      ]
    }
  ]
}

// ============================================
// 9. OPENING HOOK STYLE
// ============================================
export const openingHook: StyleCategory = {
  id: 'opening_hook',
  name: 'Opening Hook Style',
  description: 'How to grab attention in the first sentence',
  options: [
    {
      id: 'hook_type',
      label: 'Hook Type',
      hint: 'The opening sentence sets the tone. Choose what will resonate with your audience.',
      options: [
        { value: 'surprising_statistic', label: 'Surprising Statistic', hint: '"73% of..." - Credibility + curiosity. Great for data-driven audiences.' },
        { value: 'bold_contrarian', label: 'Bold Contrarian Statement', hint: '"Everything you know about X is wrong" - Provocative, attention-grabbing.' },
        { value: 'relatable_problem', label: 'Relatable Problem', hint: '"You\'ve probably experienced..." - Empathy, connection.' },
        { value: 'intriguing_question', label: 'Intriguing Question', hint: '"What if you could..." - Engages imagination.' },
        { value: 'story_anecdote', label: 'Story/Anecdote', hint: '"Last Tuesday, Sarah..." - Human, memorable.' },
        { value: 'expert_quote', label: 'Expert Quote', hint: 'Borrow authority. Good for thought leadership.' },
        { value: 'controversial_opinion', label: 'Controversial Opinion', hint: 'Take a stance. Polarizing but engaging.' },
        { value: 'future_prediction', label: 'Future Prediction', hint: '"By 2025..." - Forward-thinking, visionary.' },
        { value: 'myth_bust', label: 'Common Myth to Bust', hint: '"Most people think X, but..." - Educational hook.' },
        { value: 'direct_promise', label: 'Direct Promise', hint: '"By the end of this, you\'ll..." - Clear value proposition.' }
      ]
    }
  ]
}

// ============================================
// 10. CALL-TO-ACTION STYLE
// ============================================
export const ctaStyle: StyleCategory = {
  id: 'cta_style',
  name: 'Call-to-Action Style',
  description: 'How to ask readers to take the next step',
  options: [
    {
      id: 'cta_approach',
      label: 'CTA Approach',
      hint: 'The tone and style of your calls to action.',
      options: [
        { value: 'soft_suggestion', label: 'Soft Suggestion', hint: '"Consider trying..." - Low pressure, consultative.' },
        { value: 'direct_command', label: 'Direct Command', hint: '"Start your free trial now" - Clear, assertive.' },
        { value: 'question_based', label: 'Question-Based', hint: '"Ready to transform your...?" - Engaging, reflective.' },
        { value: 'value_focused', label: 'Value-Focused', hint: '"Get instant access to..." - Benefit-led.' },
        { value: 'urgency_driven', label: 'Urgency-Driven', hint: '"Limited time - act now" - Creates FOMO.' },
        { value: 'risk_reversal', label: 'Risk-Reversal', hint: '"Try free for 30 days" - Removes barriers.' },
        { value: 'social_proof_cta', label: 'Social Proof CTA', hint: '"Join 10,000+ customers" - Bandwagon effect.' },
        { value: 'curiosity_cta', label: 'Curiosity CTA', hint: '"See what you\'re missing" - Intriguing.' }
      ]
    },
    {
      id: 'cta_frequency',
      label: 'CTA Frequency',
      hint: 'How often and where to include calls to action.',
      options: [
        { value: 'single_end', label: 'Single CTA at End', hint: 'One clear ask at conclusion. Less salesy.' },
        { value: 'multiple_throughout', label: 'Multiple Throughout', hint: 'CTAs in intro, middle, end. More conversions, more aggressive.' },
        { value: 'subtle_embedded', label: 'Subtle Embedded', hint: 'Natural mentions within content. Soft sell.' },
        { value: 'no_hard_sell', label: 'No Hard Sell', hint: 'No explicit CTA. Pure value, brand building.' }
      ]
    }
  ]
}

// ============================================
// 11. COMPETITIVE POSITIONING
// ============================================
export const competitivePositioning: StyleCategory = {
  id: 'competitive_positioning',
  name: 'Competitive Positioning',
  description: 'How to handle competitors and market position',
  options: [
    {
      id: 'competitor_mention',
      label: 'Competitor Mention',
      hint: 'Whether and how to reference competitors.',
      options: [
        { value: 'never', label: 'Never Mention', hint: 'Focus only on your solution. Safest approach.' },
        { value: 'without_naming', label: 'Mention Without Naming', hint: '"Other solutions..." - Acknowledge competition vaguely.' },
        { value: 'name_directly', label: 'Name Directly', hint: 'Reference competitors by name. Confident, transparent.' },
        { value: 'head_to_head', label: 'Head-to-Head Comparison', hint: 'Direct comparison. For comparison pages, competitive content.' },
        { value: 'acknowledge_differentiate', label: 'Acknowledge & Differentiate', hint: 'Respect competitors, explain your difference.' }
      ]
    },
    {
      id: 'positioning_stance',
      label: 'Positioning Stance',
      hint: 'Your attitude toward competition.',
      options: [
        { value: 'we_are_best', label: 'We\'re the Best', hint: 'Confident leadership position. Back with proof.' },
        { value: 'we_are_different', label: 'We\'re Different', hint: 'Unique angle, not better/worse. Niche positioning.' },
        { value: 'we_are_for_specific_people', label: 'We\'re for Specific People', hint: 'Not for everyone - for you. Tribe building.' },
        { value: 'we_are_alternative', label: 'We\'re the Alternative', hint: 'Challenger to the incumbent. David vs Goliath.' },
        { value: 'we_complement', label: 'We Complement Others', hint: 'Works with other tools. Collaborative, ecosystem.' }
      ]
    }
  ]
}

// ============================================
// 12. FORMATTING PREFERENCES
// ============================================
export const formattingPreferences: StyleCategory = {
  id: 'formatting_preferences',
  name: 'Formatting Preferences',
  description: 'Visual structure and layout of the content',
  options: [
    {
      id: 'visual_structure',
      label: 'Visual Structure',
      hint: 'How the content is visually organized.',
      options: [
        { value: 'minimal_prose', label: 'Minimal (Prose-Focused)', hint: 'Long paragraphs, few breaks. Literary, narrative.' },
        { value: 'header_heavy', label: 'Header-Heavy', hint: 'Clear sections, scannable. Good for long content.' },
        { value: 'bullet_rich', label: 'Bullet-Point Rich', hint: 'Lists throughout. Easy to skim, action-oriented.' },
        { value: 'numbered_lists', label: 'Numbered Lists', hint: 'Sequential, ordered. For processes, rankings.' },
        { value: 'mixed_formatting', label: 'Mixed Formatting', hint: 'Variety of formats. Visually dynamic.' },
        { value: 'pull_quotes', label: 'Pull Quotes Included', hint: 'Highlighted quotes. For emphasis, sharing.' },
        { value: 'callout_boxes', label: 'Callout/Sidebar Boxes', hint: 'Tips, warnings, notes. For tutorials, guides.' }
      ]
    },
    {
      id: 'paragraph_style',
      label: 'Paragraph Style',
      hint: 'Length of paragraphs affects readability and feel.',
      options: [
        { value: 'short_2_3', label: 'Short (2-3 sentences)', hint: 'Mobile-friendly, easy to read. Modern web style.' },
        { value: 'medium_4_5', label: 'Medium (4-5 sentences)', hint: 'Balanced. Standard for most content.' },
        { value: 'long_narrative', label: 'Long (Narrative Flow)', hint: 'Immersive reading. For stories, in-depth pieces.' },
        { value: 'single_sentence_impact', label: 'Single-Sentence Paragraphs', hint: 'Dramatic. For impact moments.' }
      ]
    },
    {
      id: 'white_space',
      label: 'White Space',
      hint: 'How dense or airy the content appears.',
      options: [
        { value: 'dense', label: 'Dense', hint: 'Maximize content per page. Academic, technical.' },
        { value: 'moderate', label: 'Moderate', hint: 'Balanced readability. Standard web content.' },
        { value: 'airy', label: 'Airy', hint: 'Lots of breathing room. Premium, minimalist feel.' }
      ]
    }
  ]
}

// ============================================
// 13. EVIDENCE & CREDIBILITY
// ============================================
export const evidenceCredibility: StyleCategory = {
  id: 'evidence_credibility',
  name: 'Evidence & Credibility',
  description: 'How to back up claims and build trust',
  options: [
    {
      id: 'citation_style',
      label: 'Citation Style',
      hint: 'How heavily to cite sources and data.',
      options: [
        { value: 'heavy_academic', label: 'Heavy (Academic)', hint: 'Cite everything. Research papers, white papers.' },
        { value: 'moderate_key_claims', label: 'Moderate (Key Claims)', hint: 'Cite important stats and facts. Standard business content.' },
        { value: 'light_occasional', label: 'Light (Occasional)', hint: 'Few citations. For opinion, thought leadership.' },
        { value: 'none_opinion', label: 'None (Pure Opinion)', hint: 'No citations needed. Personal takes, editorials.' }
      ]
    },
    {
      id: 'evidence_types',
      label: 'Evidence Types',
      hint: 'What kinds of proof to prioritize. Select all that apply.',
      options: [
        { value: 'statistics', label: 'Statistics & Data', hint: 'Numbers, percentages, research data.' },
        { value: 'expert_quotes', label: 'Expert Quotes', hint: 'Perspectives from recognized authorities.' },
        { value: 'case_studies', label: 'Case Studies', hint: 'Detailed examples of success stories.' },
        { value: 'testimonials', label: 'Customer Testimonials', hint: 'Direct quotes from happy customers.' },
        { value: 'research_studies', label: 'Research Studies', hint: 'Academic or industry research.' },
        { value: 'personal_experience', label: 'Personal Experience', hint: 'First-hand accounts and stories.' },
        { value: 'industry_reports', label: 'Industry Reports', hint: 'Analyst reports, market research.' },
        { value: 'historical_examples', label: 'Historical Examples', hint: 'Past events and precedents.' }
      ]
    },
    {
      id: 'source_preference',
      label: 'Source Preference',
      hint: 'What types of sources to prioritize.',
      options: [
        { value: 'academic', label: 'Academic/Research', hint: 'Peer-reviewed, scholarly. Highest credibility.' },
        { value: 'industry_publications', label: 'Industry Publications', hint: 'Trade journals, industry news. Relevant, current.' },
        { value: 'news', label: 'News Sources', hint: 'Mainstream media. Broad credibility.' },
        { value: 'company_data', label: 'Company Data', hint: 'Your own research, customer data. Unique.' },
        { value: 'expert_interviews', label: 'Expert Interviews', hint: 'Direct quotes from authorities. Personal touch.' },
        { value: 'mixed', label: 'Mixed Sources', hint: 'Variety of source types. Comprehensive.' }
      ]
    }
  ]
}

// ============================================
// 14. HUMOR & PERSONALITY
// ============================================
export const humorPersonality: StyleCategory = {
  id: 'humor_personality',
  name: 'Humor & Personality',
  description: 'How much levity and personality to inject',
  options: [
    {
      id: 'humor_level',
      label: 'Humor Level',
      hint: 'How much humor to include. Use carefully - humor can alienate if mismatched.',
      options: [
        { value: 'none_serious', label: 'None (Completely Serious)', hint: 'No humor. For serious topics, formal contexts.' },
        { value: 'subtle_wit', label: 'Subtle (Occasional Wit)', hint: 'Light touches of cleverness. Safe for most business content.' },
        { value: 'moderate_light', label: 'Moderate (Light Throughout)', hint: 'Consistently light tone. For engaging consumer content.' },
        { value: 'heavy_entertainment', label: 'Heavy (Entertainment-Focused)', hint: 'Comedy-forward. For brands built on humor.' }
      ]
    },
    {
      id: 'humor_style',
      label: 'Humor Style',
      hint: 'The type of humor if using any.',
      options: [
        { value: 'dry_deadpan', label: 'Dry/Deadpan', hint: 'Understated, subtle. Intellectual humor.' },
        { value: 'self_deprecating', label: 'Self-Deprecating', hint: 'Humble, relatable. Builds likability.' },
        { value: 'observational', label: 'Observational', hint: '"Have you ever noticed..." - Universal, safe.' },
        { value: 'wordplay_puns', label: 'Wordplay/Puns', hint: 'Clever language. Can be groan-worthy or delightful.' },
        { value: 'pop_culture', label: 'Pop Culture References', hint: 'Current references. Can date quickly.' },
        { value: 'industry_jokes', label: 'Industry In-Jokes', hint: 'Inside humor. Builds community with insiders.' }
      ]
    }
  ]
}

// ============================================
// 15. CONTROVERSY & OPINION
// ============================================
export const controversyOpinion: StyleCategory = {
  id: 'controversy_opinion',
  name: 'Controversy & Opinion',
  description: 'How bold and opinionated to be',
  options: [
    {
      id: 'opinion_strength',
      label: 'Opinion Strength',
      hint: 'How strongly to express viewpoints.',
      options: [
        { value: 'neutral_balanced', label: 'Neutral/Balanced', hint: 'Present all sides equally. Safe, journalistic.' },
        { value: 'mild_opinion', label: 'Mild Opinion', hint: 'Gentle stance. "We believe..." approach.' },
        { value: 'clear_position', label: 'Clear Position', hint: 'Definite viewpoint. Thought leadership.' },
        { value: 'bold_provocative', label: 'Bold/Provocative', hint: 'Strong takes. Gets attention, may polarize.' },
        { value: 'controversial', label: 'Controversial', hint: 'Challenge norms. High risk, high reward.' }
      ]
    },
    {
      id: 'risk_tolerance',
      label: 'Risk Tolerance',
      hint: 'How much controversy you\'re willing to embrace.',
      options: [
        { value: 'play_safe', label: 'Play Safe', hint: 'Offend no one. Corporate-appropriate.' },
        { value: 'moderate_risk', label: 'Moderate', hint: 'Mild opinions OK. Most business content.' },
        { value: 'bold', label: 'Bold', hint: 'Strong stances welcome. Thought leadership.' },
        { value: 'edgy', label: 'Edgy', hint: 'Push boundaries. Challenger brands only.' }
      ]
    }
  ]
}

// ============================================
// 16. SEO & DISCOVERABILITY
// ============================================
export const seoDiscoverability: StyleCategory = {
  id: 'seo_discoverability',
  name: 'SEO & Discoverability',
  description: 'Search optimization priorities',
  options: [
    {
      id: 'seo_priority',
      label: 'SEO Priority',
      hint: 'How much to optimize for search engines.',
      options: [
        { value: 'seo_first', label: 'SEO-First', hint: 'Optimize for search rankings. Keywords, structure, length.' },
        { value: 'reader_first', label: 'Reader-First', hint: 'Natural flow, SEO secondary. Better reading experience.' },
        { value: 'balanced', label: 'Balanced', hint: 'Both matter equally. Most common approach.' },
        { value: 'social_first', label: 'Social-First', hint: 'Optimize for sharing, viral potential. Engagement over search.' }
      ]
    },
    {
      id: 'keyword_approach',
      label: 'Keyword Approach',
      hint: 'How to incorporate target keywords.',
      options: [
        { value: 'exact_match', label: 'Exact Match Focus', hint: 'Use exact keywords. More aggressive SEO.' },
        { value: 'semantic_natural', label: 'Semantic/Natural', hint: 'Related terms, natural language. Modern SEO.' },
        { value: 'question_featured', label: 'Question-Based', hint: 'Target featured snippets. FAQ-style.' },
        { value: 'long_tail', label: 'Long-Tail Focus', hint: 'Specific phrases, less competition.' }
      ]
    }
  ]
}

// ============================================
// 17. CONTENT FRESHNESS
// ============================================
export const contentFreshness: StyleCategory = {
  id: 'content_freshness',
  name: 'Content Freshness',
  description: 'How time-sensitive the content should be',
  options: [
    {
      id: 'timeliness',
      label: 'Timeliness',
      hint: 'How tied to current events/trends.',
      options: [
        { value: 'evergreen', label: 'Evergreen', hint: 'Timeless content. Lasts for years. Best SEO ROI.' },
        { value: 'timely_trends', label: 'Timely (Current Trends)', hint: 'References current events. More relevant, shorter lifespan.' },
        { value: 'news_pegged', label: 'News-Pegged', hint: 'Tied to specific events. Newsjacking.' },
        { value: 'seasonal', label: 'Seasonal', hint: 'Time of year relevant. Annual refresh needed.' },
        { value: 'predictive_future', label: 'Predictive/Future', hint: 'Forward-looking. Thought leadership.' }
      ]
    },
    {
      id: 'update_expectation',
      label: 'Update Expectation',
      hint: 'How often this content will need refreshing.',
      options: [
        { value: 'one_time', label: 'One-Time Publication', hint: 'Publish and done. News, announcements.' },
        { value: 'regularly_updated', label: 'Regularly Updated', hint: 'Periodic refresh. Statistics, guides.' },
        { value: 'living_document', label: 'Living Document', hint: 'Continuously updated. Resources, documentation.' }
      ]
    }
  ]
}

// ============================================
// 18. INDUSTRY COMPLIANCE
// ============================================
export const industryCompliance: StyleCategory = {
  id: 'industry_compliance',
  name: 'Industry Compliance',
  description: 'Regulatory and terminology considerations',
  options: [
    {
      id: 'compliance_awareness',
      label: 'Compliance Awareness',
      hint: 'Industry-specific language requirements.',
      options: [
        { value: 'general_none', label: 'General (No Restrictions)', hint: 'No special compliance needs. Most content.' },
        { value: 'healthcare_hipaa', label: 'Healthcare (HIPAA-Conscious)', hint: 'Careful health claims. No medical advice without disclaimers.' },
        { value: 'finance_disclaimer', label: 'Finance (Disclaimer-Aware)', hint: 'Include appropriate disclaimers. No guarantees.' },
        { value: 'legal_careful', label: 'Legal (Careful Language)', hint: 'Precise language. Avoid creating obligations.' },
        { value: 'education_accessibility', label: 'Education (Accessibility-Focused)', hint: 'Inclusive, accessible language.' },
        { value: 'government_formal', label: 'Government (Formal Requirements)', hint: 'Official language, proper procedures.' }
      ]
    },
    {
      id: 'jargon_level',
      label: 'Jargon Level',
      hint: 'How much industry-specific terminology to use.',
      options: [
        { value: 'no_jargon', label: 'No Jargon (Plain Language)', hint: 'Anyone can understand. Consumer content.' },
        { value: 'light_common', label: 'Light (Common Terms)', hint: 'Basic industry terms. Explained when needed.' },
        { value: 'industry_standard', label: 'Industry Standard', hint: 'Normal B2B terminology. For practitioners.' },
        { value: 'heavy_technical', label: 'Heavy Technical', hint: 'Full jargon OK. For specialists only.' }
      ]
    }
  ]
}

// ============================================
// ALL CATEGORIES EXPORT
// ============================================
export const allStyleCategories: StyleCategory[] = [
  toneOfVoice,
  writingStyle,
  audienceSophistication,
  contentDepth,
  brandPersonality,
  emotionalAppeal,
  perspectiveVoice,
  contentPurpose,
  openingHook,
  ctaStyle,
  competitivePositioning,
  formattingPreferences,
  evidenceCredibility,
  humorPersonality,
  controversyOpinion,
  seoDiscoverability,
  contentFreshness,
  industryCompliance
]

// ============================================
// DEFAULT VALUES (Smart Fallbacks)
// ============================================
export const defaultStyleProfile = {
  // Tone of Voice
  professional_level: 'business_professional',
  energy_level: 'balanced_steady',
  personality: 'helpful_mentor',
  emotional_tone: 'optimistic',
  
  // Writing Style
  narrative_approach: 'conversational',
  structure_style: 'problem_solution',
  sentence_style: 'mixed_variety',
  
  // Audience
  knowledge_level: 'some_familiarity',
  reading_level: 'standard_high_school',
  time_availability: 'moderate_readers',
  
  // Depth
  depth: 'moderate_depth',
  detail_level: 'tactical_practical',
  example_density: 'moderate',
  
  // Brand
  archetype: 'sage',
  positioning: 'specialist',
  
  // Emotional Appeal
  primary_appeal: 'logic_facts',
  motivation_focus: 'gain_pleasure',
  
  // Perspective
  point_of_view: 'mixed_we_you',
  author_persona: 'anonymous_brand',
  
  // Purpose
  primary_goal: 'educate',
  funnel_stage: 'consideration',
  
  // Hook
  hook_type: 'relatable_problem',
  
  // CTA
  cta_approach: 'value_focused',
  cta_frequency: 'single_end',
  
  // Competition
  competitor_mention: 'without_naming',
  positioning_stance: 'we_are_different',
  
  // Formatting
  visual_structure: 'mixed_formatting',
  paragraph_style: 'short_2_3',
  white_space: 'moderate',
  
  // Evidence
  citation_style: 'moderate_key_claims',
  evidence_types: ['statistics', 'case_studies', 'expert_quotes'],
  source_preference: 'mixed',
  
  // Humor
  humor_level: 'subtle_wit',
  humor_style: 'observational',
  
  // Opinion
  opinion_strength: 'mild_opinion',
  risk_tolerance: 'moderate_risk',
  
  // SEO
  seo_priority: 'balanced',
  keyword_approach: 'semantic_natural',
  
  // Freshness
  timeliness: 'evergreen',
  update_expectation: 'one_time',
  
  // Compliance
  compliance_awareness: 'general_none',
  jargon_level: 'light_common'
}
