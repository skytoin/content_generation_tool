'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

// ============================================
// ALL 18 STYLE CATEGORIES (COMPLETE)
// ============================================
const styleCategories = [
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
// SERVICES DATA
// ============================================
const services: Record<string, any> = {
  'blog-basic': {
    id: 'blog-basic',
    name: 'Blog Post - Basic',
    description: '1600-2000 word SEO-optimized article',
    price: 49,
    priceId: 'blog_basic',
    fields: [
      { name: 'topic', label: 'Article Topic', type: 'text', required: true, placeholder: 'e.g., 10 Tips for Remote Work Productivity' },
      { name: 'keywords', label: 'Target Keywords', type: 'text', required: true, placeholder: 'e.g., remote work, productivity, work from home' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Small business owners, Marketing managers' },
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., SaaS, Healthcare, Finance' },
      { name: 'sampleArticles', label: 'Sample Articles (Optional - for style learning)', type: 'textarea', required: false, placeholder: 'Paste 1-5 sample articles that match your desired writing style. We\'ll analyze these to match your voice.' },
      { name: 'notes', label: 'Additional Instructions', type: 'textarea', required: false, placeholder: 'Any specific points to cover, links to include, or style preferences...' },
    ],
  },
  'blog-premium': {
    id: 'blog-premium',
    name: 'Blog Post - Premium',
    description: '3000-4000 word in-depth article with research',
    price: 99,
    priceId: 'blog_premium',
    fields: [
      { name: 'topic', label: 'Article Topic', type: 'text', required: true, placeholder: 'e.g., The Complete Guide to Content Marketing in 2024' },
      { name: 'keywords', label: 'Primary & Secondary Keywords', type: 'text', required: true, placeholder: 'e.g., content marketing, content strategy, blog promotion' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Marketing directors at mid-size companies' },
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., SaaS, Healthcare, Finance' },
      { name: 'competitors', label: 'Competitor URLs (optional)', type: 'text', required: false, placeholder: 'Links to competitor articles on similar topics' },
      { name: 'internalLinks', label: 'Internal Pages to Link', type: 'textarea', required: false, placeholder: 'URLs of your pages you want linked in the article' },
      { name: 'sampleArticles', label: 'Sample Articles (Optional - for style learning)', type: 'textarea', required: false, placeholder: 'Paste 1-5 sample articles that match your desired writing style. We\'ll analyze these to match your voice.' },
      { name: 'notes', label: 'Additional Instructions', type: 'textarea', required: false, placeholder: 'Specific data to include, expert quotes, case studies...' },
    ],
  },
  'social-pack': {
    id: 'social-pack',
    name: 'Social Media Pack',
    description: '30 posts for LinkedIn, Twitter/X, and Instagram',
    price: 79,
    priceId: 'social_pack',
    fields: [
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., SaaS, E-commerce, Consulting' },
      { name: 'topics', label: 'Content Themes/Topics', type: 'textarea', required: true, placeholder: 'e.g., Product tips, Industry news, Behind the scenes, Customer success...' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who follows you on social media?' },
      { name: 'cta', label: 'Primary Call-to-Action', type: 'text', required: true, placeholder: 'e.g., Visit our website, Book a demo, Download free guide' },
      { name: 'hashtags', label: 'Brand Hashtags (if any)', type: 'text', required: false, placeholder: 'Your branded hashtags' },
      { name: 'sampleArticles', label: 'Sample Posts (Optional - for style learning)', type: 'textarea', required: false, placeholder: 'Paste 3-10 of your best-performing social posts. We\'ll analyze these to match your voice and style.' },
      { name: 'notes', label: 'Additional Context', type: 'textarea', required: false, placeholder: 'Upcoming promotions, events, product launches...' },
    ],
  },
  'email-sequence': {
    id: 'email-sequence',
    name: 'Email Sequence',
    description: '5-email nurture sequence',
    price: 149,
    priceId: 'email_sequence',
    fields: [
      { name: 'goal', label: 'Sequence Goal', type: 'select', required: true, options: ['Welcome/Onboarding', 'Lead Nurture', 'Product Launch', 'Re-engagement', 'Sales/Conversion', 'Educational Series'] },
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'product', label: 'Product/Service Being Promoted', type: 'textarea', required: true, placeholder: 'Describe what you\'re promoting and its key benefits' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who will receive these emails?' },
      { name: 'cta', label: 'Primary Call-to-Action', type: 'text', required: true, placeholder: 'e.g., Schedule demo, Start free trial, Buy now' },
      { name: 'painPoints', label: 'Customer Pain Points', type: 'textarea', required: true, placeholder: 'What problems does your product solve?' },
      { name: 'sampleArticles', label: 'Sample Emails (Optional - for style learning)', type: 'textarea', required: false, placeholder: 'Paste 2-5 of your best email examples. We\'ll analyze these to match your brand voice.' },
      { name: 'notes', label: 'Additional Context', type: 'textarea', required: false, placeholder: 'Testimonials to include, specific offers, timing preferences...' },
    ],
  },
  'seo-report': {
    id: 'seo-report',
    name: 'SEO Content Audit',
    description: 'Comprehensive content strategy report',
    price: 199,
    priceId: 'seo_report',
    fields: [
      { name: 'website', label: 'Website URL', type: 'text', required: true, placeholder: 'https://yourwebsite.com' },
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., SaaS, Healthcare, E-commerce' },
      { name: 'competitors', label: 'Main Competitors', type: 'textarea', required: true, placeholder: 'List 3-5 competitor websites' },
      { name: 'currentKeywords', label: 'Current Target Keywords', type: 'textarea', required: false, placeholder: 'Keywords you\'re currently targeting' },
      { name: 'goals', label: 'Content Goals', type: 'textarea', required: true, placeholder: 'What do you want your content to achieve? (traffic, leads, authority...)' },
      { name: 'notes', label: 'Additional Context', type: 'textarea', required: false, placeholder: 'Current challenges, past content that worked well...' },
    ],
  },
  'content-bundle': {
    id: 'content-bundle',
    name: 'Monthly Content Bundle',
    description: '4 blog posts (3000-4000 words each), 30 social posts, 1 email sequence',
    price: 399,
    priceId: 'content_bundle',
    fields: [
      { name: 'company', label: 'Company/Brand Name', type: 'text', required: true, placeholder: 'Your company name' },
      { name: 'website', label: 'Website URL', type: 'text', required: true, placeholder: 'https://yourwebsite.com' },
      { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., SaaS, Healthcare, E-commerce' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Primary customer persona' },
      { name: 'blogTopics', label: 'Blog Post Topics (4)', type: 'textarea', required: true, placeholder: 'List 4 topics for your blog posts' },
      { name: 'socialThemes', label: 'Social Media Themes', type: 'textarea', required: true, placeholder: 'Main themes for social content' },
      { name: 'emailGoal', label: 'Email Sequence Goal', type: 'select', required: true, options: ['Welcome/Onboarding', 'Lead Nurture', 'Product Launch', 'Re-engagement', 'Sales/Conversion'] },
      { name: 'sampleArticles', label: 'Sample Content (Optional - for style learning)', type: 'textarea', required: false, placeholder: 'Paste 3-5 of your best articles, emails, or social posts. We\'ll analyze these to perfectly match your brand voice.' },
      { name: 'notes', label: 'Additional Context', type: 'textarea', required: false, placeholder: 'Brand guidelines, important dates, special promotions...' },
    ],
  },
}

// Count total style options
const totalStyleOptions = styleCategories.reduce((acc, cat) => acc + cat.options.length, 0)

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  const service = services[serviceId]

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Style customization state
  const [styleSelections, setStyleSelections] = useState<Record<string, string>>({})
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showStyleOptions, setShowStyleOptions] = useState(false)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Service not found</h1>
          <a href="/#services" className="btn-primary">View All Services</a>
        </div>
      </div>
    )
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleStyleChange = (optionId: string, value: string) => {
    setStyleSelections(prev => ({ ...prev, [optionId]: value }))
  }

  const clearStyleSelection = (optionId: string) => {
    setStyleSelections(prev => {
      const newSelections = { ...prev }
      delete newSelections[optionId]
      return newSelections
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          email,
          formData,
          styleSelections,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to process order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="/#services" className="inline-flex items-center text-slate-600 hover:text-primary-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </a>

        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{service.name}</h1>
              <p className="text-slate-600">{service.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">${service.price}</div>
              <div className="text-sm text-slate-500">one-time</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">We'll send your completed content here</p>
            </div>

            <hr className="border-slate-200" />

            <h2 className="text-lg font-semibold text-slate-900">📝 Project Brief</h2>

            {service.fields.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">Select an option...</option>
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                )}
              </div>
            ))}

            <hr className="border-slate-200" />

            {/* Style Customization Section */}
            <div>
              <button
                type="button"
                onClick={() => setShowStyleOptions(!showStyleOptions)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-all"
              >
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    🎨 Advanced Style Customization
                    <span className="text-xs font-normal bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Optional
                    </span>
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {Object.keys(styleSelections).length > 0 
                      ? `${Object.keys(styleSelections).length} of ${totalStyleOptions} options customized`
                      : `Fine-tune ${totalStyleOptions} style options or let AI infer them`
                    }
                  </p>
                </div>
                <span className="text-2xl text-purple-500">{showStyleOptions ? '−' : '+'}</span>
              </button>

              {showStyleOptions && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-600 mb-4">
                    Customize any settings below. Unselected options will be intelligently inferred based on your content request.
                  </p>
                  
                  {styleCategories.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="text-left">
                          <span className="font-medium text-slate-900">{category.name}</span>
                          <span className="text-slate-500 text-sm ml-2">{category.description}</span>
                        </div>
                        <span className="text-xl text-slate-400">{expandedCategories.includes(category.id) ? '−' : '+'}</span>
                      </button>
                      
                      {expandedCategories.includes(category.id) && (
                        <div className="p-4 space-y-4 bg-white border-t border-slate-100">
                          {category.options.map((option) => (
                            <div key={option.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="font-medium text-slate-800 text-sm">{option.label}</label>
                                {styleSelections[option.id] && (
                                  <button
                                    type="button"
                                    onClick={() => clearStyleSelection(option.id)}
                                    className="text-xs text-red-500 hover:text-red-600"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{option.hint}</p>
                              <select
                                value={styleSelections[option.id] || ''}
                                onChange={(e) => e.target.value ? handleStyleChange(option.id, e.target.value) : clearStyleSelection(option.id)}
                                className={`w-full rounded-lg p-2.5 text-sm transition-all ${
                                  styleSelections[option.id] 
                                    ? 'bg-purple-50 border-2 border-purple-300' 
                                    : 'bg-white border border-slate-200'
                                }`}
                              >
                                <option value="">— Auto-infer based on content —</option>
                                {option.choices.map((choice) => (
                                  <option key={choice.value} value={choice.value}>
                                    {choice.label} — {choice.hint}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Continue to Payment - $${service.price}`
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure checkout powered by Stripe
            </p>
          </form>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">What's Included</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              8-stage AI pipeline with style learning
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% original, plagiarism-free content
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              1 free revision within 7 days
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Full commercial usage rights
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Email delivery in Word/Google Docs format
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
