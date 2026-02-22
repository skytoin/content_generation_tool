/**
 * Style Recommendations Mapper
 *
 * Deterministically maps Content Architect analysis to style option values.
 * This is a shared utility — safe for both server and client components.
 *
 * Uses fuzzy `.toLowerCase().includes()` matching on analysis fields to recommend
 * ~10 style options. Only includes keys where a confident match is found — omitted
 * keys are left for AI inference at generation time.
 */

export function mapAnalysisToStyleRecommendations(
  analysis: {
    business_context?: any
    audience_profile?: any
    content_needs?: any
    // Also accept camelCase keys from structuredData
    businessContext?: any
    audienceProfile?: any
    contentNeeds?: any
  },
  strategy?: { primaryFocus?: string },
  seoInsights?: { topKeywords?: any[] }
): Record<string, string> {
  const recs: Record<string, string> = {}

  // Support both snake_case (raw pipeline) and camelCase (structuredData) keys
  const bc = analysis.business_context || analysis.businessContext || {}
  const ap = analysis.audience_profile || analysis.audienceProfile || {}
  const cn = analysis.content_needs || analysis.contentNeeds || {}

  const industry = (bc.industry || '').toLowerCase()
  const companyType = (bc.company_type || bc.companyType || '').toLowerCase()
  const growthStage = (bc.growth_stage || bc.growthStage || '').toLowerCase()
  const purpose = (cn.primary_purpose || cn.primaryPurpose || '').toLowerCase()
  const primaryGoals = (Array.isArray(bc.primary_goals || bc.primaryGoals)
    ? (bc.primary_goals || bc.primaryGoals).join(' ')
    : ''
  ).toLowerCase()
  const demographic = (ap.primary_demographic || ap.primaryDemographic || '').toLowerCase()
  const painPoints: string[] = Array.isArray(ap.pain_points || ap.painPoints)
    ? (ap.pain_points || ap.painPoints)
    : []
  const focus = (strategy?.primaryFocus || '').toLowerCase()

  // 1. professional_level
  if (['legal', 'law', 'finance', 'banking', 'insurance', 'compliance'].some(k => industry.includes(k) || companyType.includes(k))) {
    recs.professional_level = 'corporate_formal'
  } else if (['startup', 'tech', 'saas', 'software', 'app'].some(k => industry.includes(k) || companyType.includes(k))) {
    recs.professional_level = 'smart_casual'
  } else if (['healthcare', 'medical', 'consulting', 'accounting', 'tax'].some(k => industry.includes(k) || companyType.includes(k))) {
    recs.professional_level = 'business_professional'
  } else if (['creator', 'influencer', 'personal brand', 'lifestyle'].some(k => companyType.includes(k) || industry.includes(k))) {
    recs.professional_level = 'friendly_professional'
  }

  // 2. energy_level
  if (['sell', 'convert', 'sales', 'revenue', 'purchase'].some(k => purpose.includes(k) || primaryGoals.includes(k))) {
    recs.energy_level = 'urgent_action'
  } else if (['awareness', 'brand', 'launch', 'grow'].some(k => purpose.includes(k) || primaryGoals.includes(k))) {
    recs.energy_level = 'energetic_enthusiastic'
  } else if (['educate', 'inform', 'teach', 'research'].some(k => purpose.includes(k) || primaryGoals.includes(k))) {
    recs.energy_level = 'balanced_steady'
  } else if (['trust', 'credib', 'reassur', 'healthcare', 'medical'].some(k => purpose.includes(k) || industry.includes(k))) {
    recs.energy_level = 'calm_reassuring'
  }

  // 3. personality
  if (['startup', 'disrupt', 'innovat'].some(k => growthStage.includes(k) || companyType.includes(k) || industry.includes(k))) {
    recs.personality = 'innovative_disruptor'
  } else if (['established', 'leader', 'enterprise'].some(k => growthStage.includes(k))) {
    recs.personality = 'authoritative_leader'
  } else if (['education', 'training', 'coaching', 'teach'].some(k => industry.includes(k) || purpose.includes(k))) {
    recs.personality = 'helpful_mentor'
  } else if (['consulting', 'advisor', 'professional service'].some(k => industry.includes(k) || companyType.includes(k))) {
    recs.personality = 'trusted_advisor'
  } else if (['creator', 'personal brand', 'influencer'].some(k => companyType.includes(k))) {
    recs.personality = 'relatable_friend'
  }

  // 4. emotional_tone
  if (painPoints.length >= 3) {
    recs.emotional_tone = 'empathetic'
  } else if (['inspir', 'motivat', 'vision'].some(k => purpose.includes(k) || focus.includes(k) || primaryGoals.includes(k))) {
    recs.emotional_tone = 'inspiring'
  } else if (['thought leader', 'authority', 'expert'].some(k => purpose.includes(k) || primaryGoals.includes(k) || focus.includes(k))) {
    recs.emotional_tone = 'thought_provoking'
  } else if (['serious', 'technical', 'compliance'].some(k => industry.includes(k) || purpose.includes(k))) {
    recs.emotional_tone = 'serious_straightforward'
  } else {
    recs.emotional_tone = 'optimistic'
  }

  // 5. narrative_approach
  if (['research', 'data', 'analyt', 'statistic'].some(k => purpose.includes(k) || focus.includes(k))) {
    recs.narrative_approach = 'data_driven'
  } else if (['story', 'narrative', 'personal'].some(k => purpose.includes(k) || focus.includes(k))) {
    recs.narrative_approach = 'storytelling'
  } else if (['educate', 'teach', 'explain', 'how-to', 'guide'].some(k => purpose.includes(k) || focus.includes(k))) {
    recs.narrative_approach = 'conversational'
  } else if (['opinion', 'thought lead', 'editorial'].some(k => purpose.includes(k) || focus.includes(k))) {
    recs.narrative_approach = 'editorial_opinion'
  }

  // 6. knowledge_level
  if (['executive', 'c-suite', 'ceo', 'cfo', 'director', 'senior', 'expert'].some(k => demographic.includes(k))) {
    recs.knowledge_level = 'expert_specialist'
  } else if (['developer', 'engineer', 'technical', 'specialist'].some(k => demographic.includes(k))) {
    recs.knowledge_level = 'advanced_practitioner'
  } else if (['manager', 'professional', 'practitioner'].some(k => demographic.includes(k))) {
    recs.knowledge_level = 'intermediate'
  } else if (['beginner', 'consumer', 'general public', 'general audience'].some(k => demographic.includes(k))) {
    recs.knowledge_level = 'complete_beginner'
  } else if (['small business', 'entrepreneur', 'owner'].some(k => demographic.includes(k))) {
    recs.knowledge_level = 'some_familiarity'
  }

  // 7. primary_goal
  if (['educate', 'teach', 'learn'].some(k => purpose.includes(k))) {
    recs.primary_goal = 'educate'
  } else if (['sell', 'convert', 'purchase', 'revenue'].some(k => purpose.includes(k))) {
    recs.primary_goal = 'convert'
  } else if (['lead', 'capture', 'sign up', 'email'].some(k => purpose.includes(k) || primaryGoals.includes(k))) {
    recs.primary_goal = 'generate_leads'
  } else if (['awareness', 'brand', 'recognition'].some(k => purpose.includes(k) || primaryGoals.includes(k))) {
    recs.primary_goal = 'build_trust'
  } else if (['inspir', 'motivat'].some(k => purpose.includes(k))) {
    recs.primary_goal = 'inspire'
  } else if (['inform', 'news', 'update'].some(k => purpose.includes(k))) {
    recs.primary_goal = 'inform'
  }

  // 8. seo_priority
  const keywordCount = seoInsights?.topKeywords?.length ?? 0
  if (keywordCount >= 5) {
    recs.seo_priority = 'seo_first'
  } else if (keywordCount >= 1) {
    recs.seo_priority = 'balanced'
  } else if (['social', 'twitter', 'instagram', 'linkedin'].some(k => primaryGoals.includes(k) || purpose.includes(k))) {
    recs.seo_priority = 'social_first'
  }

  // 9. positioning
  if (['leader', 'dominant', 'enterprise'].some(k => growthStage.includes(k))) {
    recs.positioning = 'market_leader'
  } else if (['startup', 'early', 'idea', 'pre-launch'].some(k => growthStage.includes(k))) {
    recs.positioning = 'innovator'
  } else if (['growth', 'scaling'].some(k => growthStage.includes(k))) {
    recs.positioning = 'challenger'
  } else if (['specialist', 'niche', 'expert'].some(k => companyType.includes(k) || industry.includes(k))) {
    recs.positioning = 'specialist'
  }

  // 10. point_of_view
  if (['personal brand', 'creator', 'influencer', 'freelancer', 'solo'].some(k => companyType.includes(k) || industry.includes(k))) {
    recs.point_of_view = 'first_person_singular'
  } else {
    recs.point_of_view = 'mixed_we_you'
  }

  return recs
}
