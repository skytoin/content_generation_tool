'use client'

import { useState, useEffect } from 'react'

// ============================================
// TYPES
// ============================================
interface Project {
  id: string
  name: string
  createdAt: string
  status: 'draft' | 'generating' | 'completed'
  formData?: any
  styleSelections?: any
  additionalInfo?: string
  result?: string
  serviceId?: string
}

// ============================================
// ALL 18 STYLE CATEGORIES (COMPLETE)
// ============================================
const styleCategories = [
  // 1. TONE OF VOICE
  {
    id: 'tone_of_voice',
    name: '🎭 Tone of Voice',
    description: 'How your content should sound and feel',
    options: [
      {
        id: 'professional_level',
        label: 'Professional Level',
        hint: 'How formal should the language be?',
        choices: [
          { value: 'corporate_formal', label: 'Corporate Formal', hint: 'Executive-level. Enterprise B2B, legal, finance.' },
          { value: 'business_professional', label: 'Business Professional', hint: 'Professional but approachable. Most B2B.' },
          { value: 'smart_casual', label: 'Smart Casual', hint: 'Relaxed professional. Tech, startups.' },
          { value: 'approachable_expert', label: 'Approachable Expert', hint: 'Friendly thought leadership.' },
          { value: 'friendly_professional', label: 'Friendly Professional', hint: 'Warm. B2C, services.' }
        ]
      },
      {
        id: 'energy_level',
        label: 'Energy Level',
        hint: 'Pace and intensity of content.',
        choices: [
          { value: 'calm_reassuring', label: 'Calm & Reassuring', hint: 'Steady, trustworthy.' },
          { value: 'balanced_steady', label: 'Balanced & Steady', hint: 'Even-keeled.' },
          { value: 'energetic_enthusiastic', label: 'Energetic & Enthusiastic', hint: 'Upbeat, positive.' },
          { value: 'bold_confident', label: 'Bold & Confident', hint: 'Strong, assertive.' },
          { value: 'urgent_action', label: 'Urgent & Action-Oriented', hint: 'Creates momentum.' }
        ]
      },
      {
        id: 'personality',
        label: 'Personality',
        hint: 'Character in your writing.',
        choices: [
          { value: 'authoritative_leader', label: 'Authoritative Leader', hint: 'Commands respect.' },
          { value: 'helpful_mentor', label: 'Helpful Mentor', hint: 'Guides and teaches.' },
          { value: 'trusted_advisor', label: 'Trusted Advisor', hint: 'Consultative.' },
          { value: 'innovative_disruptor', label: 'Innovative Disruptor', hint: 'Challenges norms.' },
          { value: 'relatable_friend', label: 'Relatable Friend', hint: 'Peer-level.' },
          { value: 'wise_teacher', label: 'Wise Teacher', hint: 'Patient, knowledgeable.' },
          { value: 'passionate_advocate', label: 'Passionate Advocate', hint: 'Enthusiastic believer.' }
        ]
      },
      {
        id: 'emotional_tone',
        label: 'Emotional Tone',
        hint: 'Underlying emotional current.',
        choices: [
          { value: 'empathetic', label: 'Empathetic & Understanding', hint: 'Shows understanding.' },
          { value: 'inspiring', label: 'Inspiring & Motivational', hint: 'Lifts readers up.' },
          { value: 'thought_provoking', label: 'Thought-Provoking', hint: 'Challenges assumptions.' },
          { value: 'humorous_witty', label: 'Humorous & Witty', hint: 'Light, entertaining.' },
          { value: 'serious_straightforward', label: 'Serious & Straightforward', hint: 'No-nonsense.' },
          { value: 'optimistic', label: 'Optimistic & Hopeful', hint: 'Positive outlook.' },
          { value: 'realistic', label: 'Realistic & Grounded', hint: 'Honest, practical.' }
        ]
      }
    ]
  },
  // 2. WRITING STYLE
  {
    id: 'writing_style',
    name: '✍️ Writing Style',
    description: 'Structure and approach',
    options: [
      {
        id: 'narrative_approach',
        label: 'Narrative Approach',
        hint: 'How content is structured.',
        choices: [
          { value: 'storytelling', label: 'Storytelling', hint: 'Narrative-driven, engaging.' },
          { value: 'data_driven', label: 'Data-Driven', hint: 'Statistics-first, credibility.' },
          { value: 'conversational', label: 'Conversational', hint: 'Like talking to a friend.' },
          { value: 'journalistic', label: 'Journalistic', hint: 'Objective, fact-based.' },
          { value: 'academic', label: 'Academic', hint: 'Thesis, evidence, conclusion.' },
          { value: 'editorial_opinion', label: 'Editorial/Opinion', hint: 'Strong point of view.' }
        ]
      },
      {
        id: 'structure_style',
        label: 'Structure Style',
        hint: 'Format and organization.',
        choices: [
          { value: 'listicle', label: 'Listicle', hint: '"7 Ways to..." Scannable.' },
          { value: 'how_to_guide', label: 'How-To Guide', hint: 'Step-by-step instructions.' },
          { value: 'problem_solution', label: 'Problem → Solution', hint: 'Classic marketing.' },
          { value: 'myth_vs_reality', label: 'Myth vs Reality', hint: 'Debunk misconceptions.' },
          { value: 'before_after', label: 'Before & After', hint: 'Show transformation.' },
          { value: 'comparison', label: 'Comparison/Versus', hint: 'Side-by-side compare.' },
          { value: 'deep_dive', label: 'Deep Dive Analysis', hint: 'Comprehensive.' },
          { value: 'quick_overview', label: 'Quick Overview', hint: 'Brief summary.' },
          { value: 'faq', label: 'FAQ Format', hint: 'Q&A style.' }
        ]
      },
      {
        id: 'sentence_style',
        label: 'Sentence Style',
        hint: 'Rhythm and flow.',
        choices: [
          { value: 'short_punchy', label: 'Short & Punchy', hint: 'Hemingway-style.' },
          { value: 'flowing_eloquent', label: 'Flowing & Eloquent', hint: 'Literary prose.' },
          { value: 'mixed_variety', label: 'Mixed Variety', hint: 'Dynamic rhythm.' },
          { value: 'question_heavy', label: 'Question-Heavy', hint: 'Engages thinking.' },
          { value: 'direct_declarative', label: 'Direct & Declarative', hint: 'Clear statements.' }
        ]
      }
    ]
  },
  // 3. AUDIENCE SOPHISTICATION
  {
    id: 'audience_sophistication',
    name: '👥 Audience Sophistication',
    description: 'Match complexity to readers',
    options: [
      {
        id: 'knowledge_level',
        label: 'Knowledge Level',
        hint: 'How much they already know.',
        choices: [
          { value: 'complete_beginner', label: 'Complete Beginner', hint: 'Explain everything.' },
          { value: 'some_familiarity', label: 'Some Familiarity', hint: 'Knows basics.' },
          { value: 'intermediate', label: 'Intermediate', hint: 'Solid foundation.' },
          { value: 'advanced_practitioner', label: 'Advanced Practitioner', hint: 'Peer-level.' },
          { value: 'expert_specialist', label: 'Expert/Specialist', hint: 'Deep technical OK.' }
        ]
      },
      {
        id: 'reading_level',
        label: 'Reading Level',
        hint: 'Vocabulary complexity.',
        choices: [
          { value: 'simple_8th_grade', label: 'Simple (8th Grade)', hint: 'Anyone understands.' },
          { value: 'standard_high_school', label: 'Standard (High School)', hint: 'General audience.' },
          { value: 'advanced_college', label: 'Advanced (College)', hint: 'Educated readers.' },
          { value: 'technical_academic', label: 'Technical/Academic', hint: 'Professionals.' }
        ]
      },
      {
        id: 'time_availability',
        label: 'Reader Time',
        hint: 'How much time readers have.',
        choices: [
          { value: 'skimmers', label: 'Skimmers', hint: 'Busy, key takeaways only.' },
          { value: 'moderate_readers', label: 'Moderate Readers', hint: '5-7 minute read.' },
          { value: 'deep_readers', label: 'Deep Readers', hint: 'Want comprehensive.' },
          { value: 'researchers', label: 'Researchers', hint: 'Want everything + sources.' }
        ]
      }
    ]
  },
  // 4. CONTENT DEPTH
  {
    id: 'content_depth',
    name: '📊 Content Depth',
    description: 'How comprehensive to be',
    options: [
      {
        id: 'depth',
        label: 'Overall Depth',
        hint: 'How deeply to explore.',
        choices: [
          { value: 'surface_overview', label: 'Surface Overview', hint: 'Key points only.' },
          { value: 'moderate_depth', label: 'Moderate Depth', hint: 'Standard blog depth.' },
          { value: 'comprehensive', label: 'Comprehensive', hint: 'Cover all angles.' },
          { value: 'exhaustive_deep_dive', label: 'Exhaustive Deep Dive', hint: 'Definitive guide.' }
        ]
      },
      {
        id: 'detail_level',
        label: 'Detail Level',
        hint: 'Strategic vs tactical.',
        choices: [
          { value: 'high_level_strategic', label: 'High-Level Strategic', hint: 'Big picture, concepts.' },
          { value: 'tactical_practical', label: 'Tactical & Practical', hint: 'Actionable advice.' },
          { value: 'step_by_step_detailed', label: 'Step-by-Step Detailed', hint: 'Specific instructions.' },
          { value: 'technical_implementation', label: 'Technical Implementation', hint: 'Code-level details.' }
        ]
      },
      {
        id: 'example_density',
        label: 'Example Density',
        hint: 'How many examples.',
        choices: [
          { value: 'minimal', label: 'Minimal (1-2)', hint: 'Conceptual focus.' },
          { value: 'moderate', label: 'Moderate (per section)', hint: 'Balanced.' },
          { value: 'heavy', label: 'Heavy (multiple)', hint: 'Example-rich.' },
          { value: 'case_study_focused', label: 'Case Study Focused', hint: 'Built around examples.' }
        ]
      }
    ]
  },
  // 5. BRAND PERSONALITY
  {
    id: 'brand_personality',
    name: '🏢 Brand Personality',
    description: 'Character and positioning',
    options: [
      {
        id: 'archetype',
        label: 'Brand Archetype',
        hint: 'Fundamental character.',
        choices: [
          { value: 'sage', label: 'The Sage', hint: 'Wise, knowledgeable. (Google, McKinsey)' },
          { value: 'hero', label: 'The Hero', hint: 'Bold, achievement. (Nike, BMW)' },
          { value: 'creator', label: 'The Creator', hint: 'Innovative. (Apple, Adobe)' },
          { value: 'caregiver', label: 'The Caregiver', hint: 'Nurturing. (J&J, UNICEF)' },
          { value: 'explorer', label: 'The Explorer', hint: 'Adventurous. (Jeep, Patagonia)' },
          { value: 'rebel', label: 'The Rebel', hint: 'Disruptive. (Harley, Virgin)' },
          { value: 'magician', label: 'The Magician', hint: 'Transformative. (Disney, Tesla)' },
          { value: 'everyman', label: 'The Everyman', hint: 'Relatable. (IKEA, Target)' },
          { value: 'ruler', label: 'The Ruler', hint: 'Premium. (Mercedes, Rolex)' },
          { value: 'jester', label: 'The Jester', hint: 'Fun. (Old Spice, M&Ms)' }
        ]
      },
      {
        id: 'positioning',
        label: 'Market Positioning',
        hint: 'vs competitors.',
        choices: [
          { value: 'market_leader', label: 'Market Leader', hint: 'We set the standard.' },
          { value: 'challenger', label: 'Challenger', hint: 'We do it differently.' },
          { value: 'specialist', label: 'Specialist', hint: 'Experts in X.' },
          { value: 'innovator', label: 'Innovator', hint: 'Ahead of the curve.' },
          { value: 'value_provider', label: 'Value Provider', hint: 'Quality at fair price.' },
          { value: 'premium_luxury', label: 'Premium/Luxury', hint: 'Best of the best.' }
        ]
      }
    ]
  },
  // 6. EMOTIONAL APPEAL
  {
    id: 'emotional_appeal',
    name: '💝 Emotional Appeal',
    description: 'Psychological triggers',
    options: [
      {
        id: 'primary_appeal',
        label: 'Primary Appeal',
        hint: 'Main psychological lever.',
        choices: [
          { value: 'logic_facts', label: 'Logic & Facts', hint: 'Data, evidence, rational.' },
          { value: 'emotion_story', label: 'Emotion & Story', hint: 'Feelings, narrative.' },
          { value: 'fomo_urgency', label: 'Fear of Missing Out', hint: 'Urgency, scarcity.' },
          { value: 'aspiration_dreams', label: 'Aspiration & Dreams', hint: 'Paint possibility.' },
          { value: 'pain_problem', label: 'Pain & Problem', hint: 'Agitate then solve.' },
          { value: 'social_proof', label: 'Social Proof', hint: 'Others are doing it.' },
          { value: 'authority_expertise', label: 'Authority & Expertise', hint: 'Trust the experts.' },
          { value: 'curiosity_intrigue', label: 'Curiosity & Intrigue', hint: 'Want to know more.' }
        ]
      },
      {
        id: 'motivation_focus',
        label: 'Motivation Focus',
        hint: 'Fundamental motivation.',
        choices: [
          { value: 'gain_pleasure', label: 'Gain Pleasure', hint: 'Benefits, rewards.' },
          { value: 'avoid_pain', label: 'Avoid Pain', hint: 'Prevent problems.' },
          { value: 'save_time', label: 'Save Time', hint: 'Efficiency, speed.' },
          { value: 'save_money', label: 'Save Money', hint: 'Cost savings, ROI.' },
          { value: 'make_money', label: 'Make Money', hint: 'Revenue, growth.' },
          { value: 'gain_status', label: 'Gain Status', hint: 'Recognition, prestige.' },
          { value: 'reduce_risk', label: 'Reduce Risk', hint: 'Safety, security.' },
          { value: 'simplify_life', label: 'Simplify Life', hint: 'Ease, clarity.' }
        ]
      }
    ]
  },
  // 7. PERSPECTIVE & VOICE
  {
    id: 'perspective_voice',
    name: '🗣️ Perspective & Voice',
    description: 'Point of view and persona',
    options: [
      {
        id: 'point_of_view',
        label: 'Point of View',
        hint: 'Grammatical perspective.',
        choices: [
          { value: 'first_person_singular', label: 'First Person ("I")', hint: 'Personal, individual.' },
          { value: 'first_person_plural', label: 'First Person ("We")', hint: 'Company voice.' },
          { value: 'second_person', label: 'Second Person ("You")', hint: 'Direct address.' },
          { value: 'third_person', label: 'Third Person', hint: 'Objective, journalistic.' },
          { value: 'mixed_we_you', label: 'Mixed (We + You)', hint: 'Conversational.' }
        ]
      },
      {
        id: 'author_persona',
        label: 'Author Persona',
        hint: 'Who is speaking.',
        choices: [
          { value: 'anonymous_brand', label: 'Anonymous Brand', hint: 'Company speaks.' },
          { value: 'named_expert', label: 'Named Expert', hint: 'Bylined content.' },
          { value: 'team_collective', label: 'Team Collective', hint: '"Our team..."' },
          { value: 'customer_perspective', label: 'Customer Perspective', hint: 'Testimonials.' },
          { value: 'industry_observer', label: 'Industry Observer', hint: 'Neutral analyst.' }
        ]
      }
    ]
  },
  // 8. CONTENT PURPOSE
  {
    id: 'content_purpose',
    name: '🎯 Content Purpose',
    description: 'Strategic goal',
    options: [
      {
        id: 'primary_goal',
        label: 'Primary Goal',
        hint: 'What to achieve.',
        choices: [
          { value: 'educate', label: 'Educate', hint: 'Teach something new.' },
          { value: 'persuade', label: 'Persuade', hint: 'Change minds.' },
          { value: 'convert', label: 'Convert', hint: 'Drive action.' },
          { value: 'entertain', label: 'Entertain', hint: 'Engage and delight.' },
          { value: 'inspire', label: 'Inspire', hint: 'Motivate action.' },
          { value: 'inform', label: 'Inform', hint: 'Share news/updates.' },
          { value: 'build_trust', label: 'Build Trust', hint: 'Establish credibility.' },
          { value: 'generate_leads', label: 'Generate Leads', hint: 'Capture interest.' }
        ]
      },
      {
        id: 'funnel_stage',
        label: 'Funnel Stage',
        hint: 'Buyer journey position.',
        choices: [
          { value: 'awareness', label: 'Awareness', hint: 'Educational, broad.' },
          { value: 'consideration', label: 'Consideration', hint: 'Researching solutions.' },
          { value: 'decision', label: 'Decision', hint: 'Comparing options.' },
          { value: 'purchase', label: 'Purchase', hint: 'Ready to buy.' },
          { value: 'retention', label: 'Retention', hint: 'Already customer.' },
          { value: 'advocacy', label: 'Advocacy', hint: 'Turn into promoters.' }
        ]
      }
    ]
  },
  // 9. OPENING HOOK
  {
    id: 'opening_hook',
    name: '🎣 Opening Hook',
    description: 'First sentence attention',
    options: [
      {
        id: 'hook_type',
        label: 'Hook Type',
        hint: 'Opening style.',
        choices: [
          { value: 'surprising_statistic', label: 'Surprising Statistic', hint: '"73% of..."' },
          { value: 'bold_contrarian', label: 'Bold Contrarian', hint: 'Challenge wisdom.' },
          { value: 'relatable_problem', label: 'Relatable Problem', hint: 'Shared pain point.' },
          { value: 'intriguing_question', label: 'Intriguing Question', hint: 'Spark curiosity.' },
          { value: 'story_anecdote', label: 'Story/Anecdote', hint: 'Narrative opening.' },
          { value: 'expert_quote', label: 'Expert Quote', hint: 'Borrow authority.' },
          { value: 'controversial_opinion', label: 'Controversial Opinion', hint: 'Take a stance.' },
          { value: 'future_prediction', label: 'Future Prediction', hint: '"By 2025..."' },
          { value: 'myth_bust', label: 'Myth Bust', hint: '"Most think X, but..."' },
          { value: 'direct_promise', label: 'Direct Promise', hint: 'Clear value prop.' }
        ]
      }
    ]
  },
  // 10. CTA STYLE
  {
    id: 'cta_style',
    name: '📢 Call-to-Action',
    description: 'Drive reader action',
    options: [
      {
        id: 'cta_approach',
        label: 'CTA Approach',
        hint: 'Tone of CTAs.',
        choices: [
          { value: 'soft_suggestion', label: 'Soft Suggestion', hint: '"Consider..."' },
          { value: 'direct_command', label: 'Direct Command', hint: '"Start now"' },
          { value: 'question_based', label: 'Question-Based', hint: '"Ready to...?"' },
          { value: 'value_focused', label: 'Value-Focused', hint: '"Get access to..."' },
          { value: 'urgency_driven', label: 'Urgency-Driven', hint: '"Limited time"' },
          { value: 'risk_reversal', label: 'Risk-Reversal', hint: '"Try free"' },
          { value: 'social_proof_cta', label: 'Social Proof CTA', hint: '"Join 10,000+"' }
        ]
      },
      {
        id: 'cta_frequency',
        label: 'CTA Frequency',
        hint: 'How often.',
        choices: [
          { value: 'single_end', label: 'Single at End', hint: 'One clear ask.' },
          { value: 'multiple_throughout', label: 'Multiple Throughout', hint: 'Intro, middle, end.' },
          { value: 'subtle_embedded', label: 'Subtle Embedded', hint: 'Natural mentions.' },
          { value: 'no_hard_sell', label: 'No Hard Sell', hint: 'Pure value.' }
        ]
      }
    ]
  },
  // 11. COMPETITIVE POSITIONING
  {
    id: 'competitive_positioning',
    name: '⚔️ Competitive Positioning',
    description: 'Handle competitors',
    options: [
      {
        id: 'competitor_mention',
        label: 'Competitor Mention',
        hint: 'Reference competitors?',
        choices: [
          { value: 'never', label: 'Never Mention', hint: 'Focus on you only.' },
          { value: 'without_naming', label: 'Without Naming', hint: '"Other solutions..."' },
          { value: 'name_directly', label: 'Name Directly', hint: 'Reference by name.' },
          { value: 'head_to_head', label: 'Head-to-Head', hint: 'Direct comparison.' },
          { value: 'acknowledge_differentiate', label: 'Acknowledge & Differentiate', hint: 'Respect + differ.' }
        ]
      },
      {
        id: 'positioning_stance',
        label: 'Positioning Stance',
        hint: 'Attitude to competition.',
        choices: [
          { value: 'we_are_best', label: "We're the Best", hint: 'Leadership position.' },
          { value: 'we_are_different', label: "We're Different", hint: 'Unique angle.' },
          { value: 'we_are_for_specific_people', label: "We're for Specific People", hint: 'Niche tribe.' },
          { value: 'we_are_alternative', label: "We're the Alternative", hint: 'Challenger.' },
          { value: 'we_complement', label: 'We Complement', hint: 'Works with others.' }
        ]
      }
    ]
  },
  // 12. FORMATTING PREFERENCES
  {
    id: 'formatting_preferences',
    name: '📐 Formatting',
    description: 'Visual structure',
    options: [
      {
        id: 'visual_structure',
        label: 'Visual Structure',
        hint: 'How organized.',
        choices: [
          { value: 'minimal_prose', label: 'Minimal (Prose)', hint: 'Long paragraphs.' },
          { value: 'header_heavy', label: 'Header-Heavy', hint: 'Clear sections.' },
          { value: 'bullet_rich', label: 'Bullet-Rich', hint: 'Lists throughout.' },
          { value: 'numbered_lists', label: 'Numbered Lists', hint: 'Sequential.' },
          { value: 'mixed_formatting', label: 'Mixed Formatting', hint: 'Variety.' },
          { value: 'callout_boxes', label: 'Callout Boxes', hint: 'Tips, warnings.' }
        ]
      },
      {
        id: 'paragraph_style',
        label: 'Paragraph Style',
        hint: 'Paragraph length.',
        choices: [
          { value: 'short_2_3', label: 'Short (2-3 sentences)', hint: 'Mobile-friendly.' },
          { value: 'medium_4_5', label: 'Medium (4-5 sentences)', hint: 'Balanced.' },
          { value: 'long_narrative', label: 'Long (Narrative)', hint: 'Immersive.' },
          { value: 'single_sentence_impact', label: 'Single-Sentence', hint: 'Dramatic impact.' }
        ]
      },
      {
        id: 'white_space',
        label: 'White Space',
        hint: 'Content density.',
        choices: [
          { value: 'dense', label: 'Dense', hint: 'Maximize content.' },
          { value: 'moderate', label: 'Moderate', hint: 'Balanced.' },
          { value: 'airy', label: 'Airy', hint: 'Breathing room.' }
        ]
      }
    ]
  },
  // 13. EVIDENCE & CREDIBILITY
  {
    id: 'evidence_credibility',
    name: '📚 Evidence & Credibility',
    description: 'Back up claims',
    options: [
      {
        id: 'citation_style',
        label: 'Citation Style',
        hint: 'How heavily to cite.',
        choices: [
          { value: 'heavy_academic', label: 'Heavy (Academic)', hint: 'Cite everything.' },
          { value: 'moderate_key_claims', label: 'Moderate (Key Claims)', hint: 'Important facts.' },
          { value: 'light_occasional', label: 'Light (Occasional)', hint: 'Few citations.' },
          { value: 'none_opinion', label: 'None (Opinion)', hint: 'No citations.' }
        ]
      },
      {
        id: 'source_preference',
        label: 'Source Preference',
        hint: 'Types of sources.',
        choices: [
          { value: 'academic', label: 'Academic/Research', hint: 'Peer-reviewed.' },
          { value: 'industry_publications', label: 'Industry Publications', hint: 'Trade journals.' },
          { value: 'news', label: 'News Sources', hint: 'Mainstream media.' },
          { value: 'company_data', label: 'Company Data', hint: 'Your own research.' },
          { value: 'mixed', label: 'Mixed Sources', hint: 'Variety.' }
        ]
      }
    ]
  },
  // 14. HUMOR & PERSONALITY
  {
    id: 'humor_personality',
    name: '😄 Humor & Personality',
    description: 'Levity and fun',
    options: [
      {
        id: 'humor_level',
        label: 'Humor Level',
        hint: 'How much humor.',
        choices: [
          { value: 'none_serious', label: 'None (Serious)', hint: 'No humor.' },
          { value: 'subtle_wit', label: 'Subtle (Wit)', hint: 'Light touches.' },
          { value: 'moderate_light', label: 'Moderate (Light)', hint: 'Consistently light.' },
          { value: 'heavy_entertainment', label: 'Heavy (Entertainment)', hint: 'Comedy-forward.' }
        ]
      },
      {
        id: 'humor_style',
        label: 'Humor Style',
        hint: 'Type of humor.',
        choices: [
          { value: 'dry_deadpan', label: 'Dry/Deadpan', hint: 'Understated.' },
          { value: 'self_deprecating', label: 'Self-Deprecating', hint: 'Humble, relatable.' },
          { value: 'observational', label: 'Observational', hint: '"Have you noticed..."' },
          { value: 'wordplay_puns', label: 'Wordplay/Puns', hint: 'Clever language.' },
          { value: 'industry_jokes', label: 'Industry In-Jokes', hint: 'Inside humor.' }
        ]
      }
    ]
  },
  // 15. CONTROVERSY & OPINION
  {
    id: 'controversy_opinion',
    name: '🔥 Controversy & Opinion',
    description: 'How bold to be',
    options: [
      {
        id: 'opinion_strength',
        label: 'Opinion Strength',
        hint: 'How strongly to express.',
        choices: [
          { value: 'neutral_balanced', label: 'Neutral/Balanced', hint: 'All sides equally.' },
          { value: 'mild_opinion', label: 'Mild Opinion', hint: '"We believe..."' },
          { value: 'clear_position', label: 'Clear Position', hint: 'Definite viewpoint.' },
          { value: 'bold_provocative', label: 'Bold/Provocative', hint: 'Strong takes.' },
          { value: 'controversial', label: 'Controversial', hint: 'Challenge norms.' }
        ]
      },
      {
        id: 'risk_tolerance',
        label: 'Risk Tolerance',
        hint: 'Controversy comfort.',
        choices: [
          { value: 'play_safe', label: 'Play Safe', hint: 'Offend no one.' },
          { value: 'moderate_risk', label: 'Moderate', hint: 'Mild opinions OK.' },
          { value: 'bold', label: 'Bold', hint: 'Strong stances.' },
          { value: 'edgy', label: 'Edgy', hint: 'Push boundaries.' }
        ]
      }
    ]
  },
  // 16. SEO & DISCOVERABILITY
  {
    id: 'seo_discoverability',
    name: '🔍 SEO & Discoverability',
    description: 'Search optimization',
    options: [
      {
        id: 'seo_priority',
        label: 'SEO Priority',
        hint: 'Search optimization level.',
        choices: [
          { value: 'seo_first', label: 'SEO-First', hint: 'Optimize for rankings.' },
          { value: 'reader_first', label: 'Reader-First', hint: 'Natural flow.' },
          { value: 'balanced', label: 'Balanced', hint: 'Both matter.' },
          { value: 'social_first', label: 'Social-First', hint: 'Optimize for sharing.' }
        ]
      },
      {
        id: 'keyword_approach',
        label: 'Keyword Approach',
        hint: 'How to use keywords.',
        choices: [
          { value: 'exact_match', label: 'Exact Match', hint: 'Use exact keywords.' },
          { value: 'semantic_natural', label: 'Semantic/Natural', hint: 'Related terms.' },
          { value: 'question_featured', label: 'Question-Based', hint: 'Featured snippets.' },
          { value: 'long_tail', label: 'Long-Tail Focus', hint: 'Specific phrases.' }
        ]
      }
    ]
  },
  // 17. CONTENT FRESHNESS
  {
    id: 'content_freshness',
    name: '📅 Content Freshness',
    description: 'Time sensitivity',
    options: [
      {
        id: 'timeliness',
        label: 'Timeliness',
        hint: 'How tied to current events.',
        choices: [
          { value: 'evergreen', label: 'Evergreen', hint: 'Timeless, lasts years.' },
          { value: 'timely_trends', label: 'Timely (Trends)', hint: 'Current events.' },
          { value: 'news_pegged', label: 'News-Pegged', hint: 'Tied to news.' },
          { value: 'seasonal', label: 'Seasonal', hint: 'Time of year.' },
          { value: 'predictive_future', label: 'Predictive/Future', hint: 'Forward-looking.' }
        ]
      },
      {
        id: 'update_expectation',
        label: 'Update Expectation',
        hint: 'Refresh frequency.',
        choices: [
          { value: 'one_time', label: 'One-Time', hint: 'Publish and done.' },
          { value: 'regularly_updated', label: 'Regularly Updated', hint: 'Periodic refresh.' },
          { value: 'living_document', label: 'Living Document', hint: 'Continuously updated.' }
        ]
      }
    ]
  },
  // 18. INDUSTRY COMPLIANCE
  {
    id: 'industry_compliance',
    name: '⚖️ Industry Compliance',
    description: 'Regulatory considerations',
    options: [
      {
        id: 'compliance_awareness',
        label: 'Compliance Awareness',
        hint: 'Industry requirements.',
        choices: [
          { value: 'general_none', label: 'General (None)', hint: 'No restrictions.' },
          { value: 'healthcare_hipaa', label: 'Healthcare (HIPAA)', hint: 'Careful health claims.' },
          { value: 'finance_disclaimer', label: 'Finance (Disclaimers)', hint: 'Include disclaimers.' },
          { value: 'legal_careful', label: 'Legal (Careful)', hint: 'Precise language.' },
          { value: 'education_accessibility', label: 'Education (Accessible)', hint: 'Inclusive language.' }
        ]
      },
      {
        id: 'jargon_level',
        label: 'Jargon Level',
        hint: 'Industry terminology.',
        choices: [
          { value: 'no_jargon', label: 'No Jargon', hint: 'Plain language.' },
          { value: 'light_common', label: 'Light (Common)', hint: 'Basic terms.' },
          { value: 'industry_standard', label: 'Industry Standard', hint: 'Normal B2B.' },
          { value: 'heavy_technical', label: 'Heavy Technical', hint: 'Full jargon OK.' }
        ]
      }
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================
const generateId = () => Math.random().toString(36).substring(2, 15)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============================================
// CONTENT VIEWER COMPONENT
// ============================================
const ContentViewer = ({ project, onBack }: { project: Project, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'report'>('content')
  const [copied, setCopied] = useState(false)
  
  const parseResult = (result: string) => {
    const reportStart = result.indexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (reportStart > 0) {
      return {
        content: result.substring(0, reportStart).trim(),
        report: result.substring(reportStart).trim()
      }
    }
    return { content: result, report: '' }
  }
  
  const { content, report } = parseResult(project.result || '')
  
  const formatContent = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-gray-700">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-6 mb-6">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 mb-2 list-decimal"><span class="font-semibold">$1.</span> $2</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed text-lg">')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-gray-700">
              <span>←</span> Back to Editor
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <p className="text-sm text-gray-400">Created {formatDate(project.createdAt)}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">✓ Completed</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setActiveTab('content')} className={`px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'content' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>📄 Content</button>
          <button onClick={() => setActiveTab('report')} className={`px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'report' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>📊 Quality Report</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-8 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'content' ? (
            <div className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-8 py-6 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-white">{project.formData?.topic || project.name}</h2>
                <p className="text-gray-400 mt-1">Generated by ContentForge AI • 8-Stage Premium Pipeline</p>
              </div>
              <div className="px-8 py-8">
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-300 leading-relaxed text-lg">${formatContent(content)}</p>` }} />
              </div>
              <div className="px-8 py-5 bg-gray-900/50 border-t border-gray-700/50 flex items-center justify-between">
                <div className="text-sm text-gray-500">{content.split(/\s+/).length.toLocaleString()} words</div>
                <div className="flex gap-3">
                  <button onClick={handleCopy} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                  <button onClick={() => { const blob = new Blob([content], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.md`; a.click(); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">💾 Download</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 px-8 py-6 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-white">Quality Assurance Report</h2>
              </div>
              <div className="p-8">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono leading-relaxed overflow-auto">{report}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function TestPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [viewMode, setViewMode] = useState<'editor' | 'viewer'>('editor')
  
  const [serviceId, setServiceId] = useState('blog-premium')
  const [formData, setFormData] = useState({ topic: '', company: '', audience: '', goals: '', sampleArticles: '' })
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [styleSelections, setStyleSelections] = useState<Record<string, string>>({})
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('contentforge_projects')
    if (saved) setProjects(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('contentforge_projects', JSON.stringify(projects))
  }, [projects])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId])
  }

  const handleStyleChange = (optionId: string, value: string) => {
    setStyleSelections(prev => ({ ...prev, [optionId]: value }))
  }

  const clearStyleSelection = (optionId: string) => {
    setStyleSelections(prev => { const n = { ...prev }; delete n[optionId]; return n })
  }

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return
    const newProject: Project = { id: generateId(), name: newProjectName.trim(), createdAt: new Date().toISOString(), status: 'draft' }
    setProjects(prev => [newProject, ...prev])
    setActiveProject(newProject)
    setShowNewProjectModal(false)
    setNewProjectName('')
    setViewMode('editor')
    setFormData({ topic: '', company: '', audience: '', goals: '', sampleArticles: '' })
    setAdditionalInfo('')
    setStyleSelections({})
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
      if (activeProject?.id === projectId) { setActiveProject(null); setViewMode('editor') }
    }
  }

  const handleSubmit = async () => {
    if (!activeProject) return
    setLoading(true)
    setError('')
    setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, status: 'generating' as const, formData, styleSelections, additionalInfo, serviceId } : p))
    setActiveProject(prev => prev ? { ...prev, status: 'generating' } : null)

    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceId, formData, styleSelections, additionalInfo }) })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      const updatedProject = { ...activeProject, status: 'completed' as const, result: data.content, formData, styleSelections, additionalInfo, serviceId }
      setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p))
      setActiveProject(updatedProject)
      setViewMode('viewer')
    } catch (err: any) {
      setError(err.message)
      setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, status: 'draft' as const } : p))
      setActiveProject(prev => prev ? { ...prev, status: 'draft' } : null)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProject = (project: Project) => {
    setActiveProject(project)
    if (project.status === 'completed') { setViewMode('viewer') }
    else {
      setViewMode('editor')
      if (project.formData) setFormData(project.formData)
      if (project.styleSelections) setStyleSelections(project.styleSelections)
      if (project.additionalInfo) setAdditionalInfo(project.additionalInfo)
      if (project.serviceId) setServiceId(project.serviceId)
    }
  }

  // Count total options
  const totalOptions = styleCategories.reduce((acc, cat) => acc + cat.options.length, 0)

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl">⚡</div>
            <div>
              <h1 className="text-lg font-bold text-white">ContentForge</h1>
              <p className="text-xs text-gray-400">AI Content Generator</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <button onClick={() => setShowNewProjectModal(true)} className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25">
            <span className="text-xl">+</span> New Project
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Projects</h3>
          {projects.length === 0 ? (
            <div className="text-center py-12"><div className="text-4xl mb-3">📁</div><p className="text-sm text-gray-500">No projects yet</p></div>
          ) : (
            <div className="space-y-2">
              {projects.map(project => (
                <div key={project.id} className={`group relative rounded-xl transition-all cursor-pointer ${activeProject?.id === project.id ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50' : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'}`}>
                  <button onClick={() => handleSelectProject(project)} className="w-full p-3 text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{project.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(project.createdAt)}</p>
                      </div>
                      <span className={`ml-2 w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${project.status === 'completed' ? 'bg-green-500' : project.status === 'generating' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    </div>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id) }} className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> Test Mode
          </div>
        </div>
      </div>

      {/* Main */}
      {!activeProject ? (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20">
          <div className="text-center max-w-md px-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl shadow-purple-500/30">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to ContentForge AI</h2>
            <p className="text-gray-400 mb-8 text-lg">Create premium AI content with our 8-stage pipeline.</p>
            <button onClick={() => setShowNewProjectModal(true)} className="py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold transition-all text-lg shadow-xl shadow-purple-500/25">+ Create Your First Project</button>
          </div>
        </div>
      ) : viewMode === 'viewer' && activeProject.status === 'completed' ? (
        <ContentViewer project={activeProject} onBack={() => setViewMode('editor')} />
      ) : (
        <div className="flex-1 overflow-auto bg-gray-900">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{activeProject.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${activeProject.status === 'completed' ? 'bg-green-500/20 text-green-400' : activeProject.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{activeProject.status}</span>
              </div>
              <p className="text-gray-400">Configure and generate your content</p>
            </div>

            {/* Content Type */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="text-2xl">📦</span> Content Type</h2>
              <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-purple-500 transition-all">
                <option value="blog-basic">Blog Post - Basic (1600-2000 words) - $49</option>
                <option value="blog-premium">Blog Post - Premium (3000-4000 words) - $99</option>
                <option value="social-pack">Social Media Pack (30 posts) - $79</option>
                <option value="email-sequence">Email Sequence (5 emails) - $149</option>
                <option value="seo-report">SEO Content Audit (Strategy Report) - $199</option>
                <option value="content-bundle">Monthly Content Bundle (4 blogs + 30 social + emails) - $399</option>
              </select>
            </div>

            {/* Basic Info */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="text-2xl">📝</span> Basic Information</h2>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-2">Topic / Title *</label><input type="text" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} placeholder="e.g., How AI is Transforming Small Business" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-purple-500 transition-all" /></div>
                <div><label className="block text-sm text-gray-400 mb-2">Company / Brand *</label><input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g., Acme Software" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-purple-500 transition-all" /></div>
                <div><label className="block text-sm text-gray-400 mb-2">Target Audience *</label><input type="text" value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} placeholder="e.g., Non-technical startup founders" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-purple-500 transition-all" /></div>
                <div><label className="block text-sm text-gray-400 mb-2">Goals</label><input type="text" value={formData.goals} onChange={(e) => setFormData({...formData, goals: e.target.value})} placeholder="e.g., Generate leads for free trial signups" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-purple-500 transition-all" /></div>
              </div>
            </div>

            {/* Style Learning */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">📚</span> Teach Us Your Writing Style</h2>
              <p className="text-gray-400 text-sm mb-4">Paste 1-5 sample articles to match your voice.</p>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300 font-medium mb-2">🎯 What we analyze:</p>
                <ul className="text-sm text-blue-200/70 space-y-1">
                  <li>• Tone, formality, and personality</li>
                  <li>• Sentence patterns and rhythm</li>
                  <li>• Vocabulary and signature phrases</li>
                </ul>
              </div>
              <textarea value={formData.sampleArticles} onChange={(e) => setFormData({...formData, sampleArticles: e.target.value})} placeholder="Paste your existing articles or content here..." className="w-full bg-gray-700 rounded-lg p-3 text-white h-40 border border-gray-600 focus:border-purple-500 transition-all" />
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">📎</span> Additional Information</h2>
              <p className="text-gray-400 text-sm mb-4">Links, facts, requirements, or special requests.</p>
              <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Enter any additional context..." className="w-full bg-gray-700 rounded-lg p-3 text-white h-28 border border-gray-600 focus:border-purple-500 transition-all" />
            </div>

            {/* Style Options - ALL 18 CATEGORIES */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🎨</span> Style Customization</h2>
              <p className="text-gray-400 text-sm mb-4">Customize any of the {totalOptions} style options or let AI infer.</p>
              <div className="text-sm text-purple-400 mb-4">{Object.keys(styleSelections).length} of {totalOptions} options selected</div>

              <div className="space-y-2">
                {styleCategories.map((category) => (
                  <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                      <div className="text-left">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{category.description}</span>
                      </div>
                      <span className="text-xl text-gray-400">{expandedCategories.includes(category.id) ? '−' : '+'}</span>
                    </button>
                    {expandedCategories.includes(category.id) && (
                      <div className="p-4 space-y-4 bg-gray-800/50">
                        {category.options.map((option) => (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="font-medium text-white text-sm">{option.label}</label>
                              {styleSelections[option.id] && <button onClick={() => clearStyleSelection(option.id)} className="text-xs text-red-400 hover:text-red-300">Clear</button>}
                            </div>
                            <p className="text-xs text-gray-500">{option.hint}</p>
                            <select value={styleSelections[option.id] || ''} onChange={(e) => e.target.value ? handleStyleChange(option.id, e.target.value) : clearStyleSelection(option.id)} className={`w-full rounded-lg p-2.5 text-sm transition-all ${styleSelections[option.id] ? 'bg-purple-900/30 border border-purple-500' : 'bg-gray-700 border border-gray-600'}`}>
                              <option value="">— Auto-infer —</option>
                              {option.choices.map((choice) => (
                                <option key={choice.value} value={choice.value}>{choice.label} — {choice.hint}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button onClick={handleSubmit} disabled={loading || !formData.topic || !formData.company || !formData.audience} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${loading || !formData.topic || !formData.company || !formData.audience ? 'bg-gray-700 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-500/25'}`}>
              {loading ? '⏳ Generating (2-5 min)...' : '🚀 Generate Content'}
            </button>

            {loading && <div className="mt-6 text-center"><div className="inline-flex items-center gap-3 bg-gray-800 rounded-xl px-6 py-4 border border-gray-700"><div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div><span className="text-gray-300">Running 8-stage pipeline...</span></div></div>}
            {error && <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl"><strong className="text-red-400">Error:</strong> <span className="text-red-300">{error}</span></div>}
          </div>
        </div>
      )}

      {/* Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
            <p className="text-gray-400 mb-6">Give your project a name.</p>
            <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., Q1 Blog Series..." className="w-full bg-gray-700 rounded-xl p-4 text-white mb-6 border border-gray-600 focus:border-purple-500 transition-all text-lg" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()} />
            <div className="flex gap-3">
              <button onClick={() => { setShowNewProjectModal(false); setNewProjectName('') }} className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${newProjectName.trim() ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500' : 'bg-gray-700 cursor-not-allowed text-gray-500'}`}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
