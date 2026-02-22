'use client'

import { tokens } from '../primitives/design-tokens'
import { InkButton } from '../primitives/InkButton'
import { InkCard } from '../primitives/InkCard'
import { InkBadge } from '../primitives/InkBadge'
import { useState, useEffect } from 'react'

// Company profile type
export interface CompanyProfile {
  id: string
  name: string
  isDefault: boolean
  companyName: string
  industry: string | null
  companyDescription: string | null
  companySize: string | null
  websiteUrl: string | null
  brandVoice: string | null
  brandGuidelines: string | null
  sampleContent: string | null
  brandColors: string[] | null
  emojiPreference: string | null
  controversyLevel: string | null
  primaryAudience: string | null
  secondaryAudiences: string | null
  audiencePainPoints: string | null
  audienceAspirations: string | null
  primaryGoals: string | null
  keyMessages: string | null
  uniqueSellingPoints: string | null
  mustIncludeKeywords: string | null
  mustAvoidKeywords: string | null
  competitorUrls: string | null
  createdAt: string
  updatedAt: string
  _count?: { projects: number }
}

const companySizes = [
  { id: 'startup', label: 'Startup' },
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'enterprise', label: 'Enterprise' },
]

const emojiOptions = [
  { id: 'none', label: 'None' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'heavy', label: 'Heavy' },
]

const controversyOptions = [
  { id: 'safe', label: 'Safe' },
  { id: 'mild_opinion', label: 'Mild Opinion' },
  { id: 'clear_position', label: 'Clear Position' },
  { id: 'spicy', label: 'Spicy' },
]

function getCompletenessScore(profile: CompanyProfile): number {
  const fields = [
    profile.companyName,
    profile.industry,
    profile.companyDescription,
    profile.companySize,
    profile.brandVoice,
    profile.sampleContent,
    profile.primaryAudience,
    profile.primaryGoals,
    profile.keyMessages,
    profile.uniqueSellingPoints,
  ]
  const filled = fields.filter(f => f && f.trim()).length
  return Math.round((filled / fields.length) * 100)
}

// Completeness ring component
function CompletenessRing({ score }: { score: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" className="transform -rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke={tokens.colors.paper.border} strokeWidth="3" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={score >= 70 ? tokens.colors.sage[500] : tokens.colors.ink[400]}
          strokeWidth="3" strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute text-xs font-medium"
        style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
      >
        {score}%
      </span>
    </div>
  )
}

// Form section component
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-sm font-medium uppercase tracking-wider"
        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

// Form field component
function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
      >
        {label} {required && <span style={{ color: tokens.colors.ink[500] }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: tokens.colors.paper.warm,
  border: `1px solid ${tokens.colors.paper.border}`,
  fontFamily: tokens.fonts.sans,
  color: tokens.colors.text.primary,
}

// Empty form state
const emptyForm: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt' | '_count'> = {
  name: '',
  isDefault: false,
  companyName: '',
  industry: null,
  companyDescription: null,
  companySize: null,
  websiteUrl: null,
  brandVoice: null,
  brandGuidelines: null,
  sampleContent: null,
  brandColors: null,
  emojiPreference: null,
  controversyLevel: null,
  primaryAudience: null,
  secondaryAudiences: null,
  audiencePainPoints: null,
  audienceAspirations: null,
  primaryGoals: null,
  keyMessages: null,
  uniqueSellingPoints: null,
  mustIncludeKeywords: null,
  mustAvoidKeywords: null,
  competitorUrls: null,
}

type FormMode = 'list' | 'create' | 'edit'

export function InkProfiles() {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mode, setMode] = useState<FormMode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)

  const formSteps = [
    { id: 'identity', label: 'Identity' },
    { id: 'voice', label: 'Brand Voice' },
    { id: 'audience', label: 'Audience' },
    { id: 'goals', label: 'Goals' },
    { id: 'rules', label: 'Rules' },
  ]

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/company-profiles')
      if (res.ok) {
        const data = await res.json()
        setProfiles(data)
      }
    } catch (err) {
      setError('Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleCreate = () => {
    setForm({ ...emptyForm, isDefault: profiles.length === 0 })
    setEditingId(null)
    setFormStep(0)
    setMode('create')
    setError('')
    setSuccess('')
  }

  const handleEdit = (profile: CompanyProfile) => {
    setForm({
      name: profile.name,
      isDefault: profile.isDefault,
      companyName: profile.companyName,
      industry: profile.industry,
      companyDescription: profile.companyDescription,
      companySize: profile.companySize,
      websiteUrl: profile.websiteUrl,
      brandVoice: profile.brandVoice,
      brandGuidelines: profile.brandGuidelines,
      sampleContent: profile.sampleContent,
      brandColors: profile.brandColors,
      emojiPreference: profile.emojiPreference,
      controversyLevel: profile.controversyLevel,
      primaryAudience: profile.primaryAudience,
      secondaryAudiences: profile.secondaryAudiences,
      audiencePainPoints: profile.audiencePainPoints,
      audienceAspirations: profile.audienceAspirations,
      primaryGoals: profile.primaryGoals,
      keyMessages: profile.keyMessages,
      uniqueSellingPoints: profile.uniqueSellingPoints,
      mustIncludeKeywords: profile.mustIncludeKeywords,
      mustAvoidKeywords: profile.mustAvoidKeywords,
      competitorUrls: profile.competitorUrls,
    })
    setEditingId(profile.id)
    setFormStep(0)
    setMode('edit')
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.companyName.trim()) {
      setError('Profile name and company name are required')
      setFormStep(0)
      return
    }

    setSaving(true)
    setError('')

    try {
      const url = editingId ? `/api/company-profiles/${editingId}` : '/api/company-profiles'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      setSuccess(editingId ? 'Profile updated successfully!' : 'Profile created successfully!')
      setMode('list')
      await fetchProfiles()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/company-profiles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Profile deleted')
      setDeleteConfirm(null)
      await fetchProfiles()
    } catch (err) {
      setError('Failed to delete profile')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/company-profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })
      if (res.ok) {
        await fetchProfiles()
        setSuccess('Default profile updated')
      }
    } catch (err) {
      setError('Failed to update default')
    }
  }

  const handleDuplicate = (profile: CompanyProfile) => {
    setForm({
      ...profile,
      name: `${profile.name} (Copy)`,
      isDefault: false,
    })
    setEditingId(null)
    setFormStep(0)
    setMode('create')
  }

  // Auto-clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // FORM VIEW
  if (mode === 'create' || mode === 'edit') {
    return (
      <div className="min-h-screen" style={{ background: tokens.colors.paper.cream }}>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-8">
            <button
              onClick={() => setMode('list')}
              className="flex items-center gap-2 text-sm mb-4 transition-colors"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Profiles
            </button>
            <h1
              className="text-3xl font-light"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              {editingId ? 'Edit Profile' : 'Create Profile'}
            </h1>
          </header>

          {/* Step Navigation */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
            {formSteps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setFormStep(i)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  background: formStep === i ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                  color: formStep === i ? '#fff' : tokens.colors.text.secondary,
                  fontFamily: tokens.fonts.sans,
                }}
              >
                {step.label}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl"
              style={{ background: tokens.colors.ink[50], border: `1px solid ${tokens.colors.ink[200]}` }}
            >
              <p style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans, fontSize: '0.875rem' }}>{error}</p>
            </div>
          )}

          <InkCard variant="elevated" padding="xl">
            {/* Step: Identity */}
            {formStep === 0 && (
              <div className="space-y-5">
                <FormSection title="Company Identity">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Profile Name" required>
                      <input
                        type="text"
                        placeholder="e.g., My SaaS Startup"
                        value={form.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={inputStyle}
                      />
                    </FormField>
                    <FormField label="Company Name" required>
                      <input
                        type="text"
                        placeholder="e.g., Acme Corporation"
                        value={form.companyName}
                        onChange={(e) => updateForm('companyName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={inputStyle}
                      />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Industry">
                      <input
                        type="text"
                        placeholder="e.g., Technology, Healthcare"
                        value={form.industry || ''}
                        onChange={(e) => updateForm('industry', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={inputStyle}
                      />
                    </FormField>
                    <FormField label="Website URL">
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={form.websiteUrl || ''}
                        onChange={(e) => updateForm('websiteUrl', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={inputStyle}
                      />
                    </FormField>
                  </div>
                  <FormField label="Company Size">
                    <div className="flex flex-wrap gap-2">
                      {companySizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => updateForm('companySize', form.companySize === size.id ? null : size.id)}
                          className="px-4 py-2 rounded-lg transition-all text-sm"
                          style={{
                            background: form.companySize === size.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: form.companySize === size.id ? '#fff' : tokens.colors.text.primary,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Company Description">
                    <textarea
                      placeholder="Brief elevator pitch about your company..."
                      value={form.companyDescription || ''}
                      onChange={(e) => updateForm('companyDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  {/* Default profile toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: tokens.colors.paper.warm }}
                  >
                    <div>
                      <p className="font-medium text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                        Set as Default Profile
                      </p>
                      <p className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                        Auto-selected when creating new projects
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateForm('isDefault', !form.isDefault)}
                      className="relative w-12 h-6 rounded-full transition-colors"
                      style={{ background: form.isDefault ? tokens.colors.ink[700] : tokens.colors.paper.border }}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ left: form.isDefault ? '26px' : '4px' }}
                      />
                    </button>
                  </div>
                </FormSection>
              </div>
            )}

            {/* Step: Brand Voice */}
            {formStep === 1 && (
              <div className="space-y-5">
                <FormSection title="Brand Voice & Style">
                  <FormField label="Writing Tone Description">
                    <textarea
                      placeholder="e.g., Professional but approachable, uses analogies and real-world examples..."
                      value={form.brandVoice || ''}
                      onChange={(e) => updateForm('brandVoice', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Brand Guidelines">
                    <textarea
                      placeholder="Paste your brand guidelines document or key points..."
                      value={form.brandGuidelines || ''}
                      onChange={(e) => updateForm('brandGuidelines', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Sample Content for Voice Cloning">
                    <div
                      className="p-3 rounded-lg mb-2"
                      style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[200]}` }}
                    >
                      <p className="text-xs" style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans }}>
                        Paste past posts or articles so AI can learn your writing style
                      </p>
                    </div>
                    <textarea
                      placeholder="Paste 1-5 sample posts or articles..."
                      value={form.sampleContent || ''}
                      onChange={(e) => updateForm('sampleContent', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Emoji Usage">
                      <div className="flex flex-wrap gap-2">
                        {emojiOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateForm('emojiPreference', form.emojiPreference === opt.id ? null : opt.id)}
                            className="px-3 py-2 rounded-lg transition-all text-sm"
                            style={{
                              background: form.emojiPreference === opt.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                              color: form.emojiPreference === opt.id ? '#fff' : tokens.colors.text.primary,
                              fontFamily: tokens.fonts.sans,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Controversy Level">
                      <div className="flex flex-wrap gap-2">
                        {controversyOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateForm('controversyLevel', form.controversyLevel === opt.id ? null : opt.id)}
                            className="px-3 py-2 rounded-lg transition-all text-sm"
                            style={{
                              background: form.controversyLevel === opt.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                              color: form.controversyLevel === opt.id ? '#fff' : tokens.colors.text.primary,
                              fontFamily: tokens.fonts.sans,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </FormField>
                  </div>
                </FormSection>
              </div>
            )}

            {/* Step: Audience */}
            {formStep === 2 && (
              <div className="space-y-5">
                <FormSection title="Target Audience">
                  <FormField label="Primary Audience">
                    <textarea
                      placeholder="e.g., Marketing managers aged 30-45 at B2B SaaS companies..."
                      value={form.primaryAudience || ''}
                      onChange={(e) => updateForm('primaryAudience', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Secondary Audiences">
                    <textarea
                      placeholder="Other audiences you want to reach..."
                      value={form.secondaryAudiences || ''}
                      onChange={(e) => updateForm('secondaryAudiences', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Audience Pain Points">
                    <textarea
                      placeholder="What problems does your audience face?"
                      value={form.audiencePainPoints || ''}
                      onChange={(e) => updateForm('audiencePainPoints', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Audience Aspirations">
                    <textarea
                      placeholder="What does your audience want to achieve?"
                      value={form.audienceAspirations || ''}
                      onChange={(e) => updateForm('audienceAspirations', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                </FormSection>
              </div>
            )}

            {/* Step: Goals */}
            {formStep === 3 && (
              <div className="space-y-5">
                <FormSection title="Goals & Messaging">
                  <FormField label="Primary Marketing Goals">
                    <textarea
                      placeholder="e.g., Brand awareness, lead generation, thought leadership..."
                      value={form.primaryGoals || ''}
                      onChange={(e) => updateForm('primaryGoals', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Key Messages">
                    <textarea
                      placeholder="Core talking points you want in all content..."
                      value={form.keyMessages || ''}
                      onChange={(e) => updateForm('keyMessages', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Unique Selling Points">
                    <textarea
                      placeholder="What makes you different from competitors?"
                      value={form.uniqueSellingPoints || ''}
                      onChange={(e) => updateForm('uniqueSellingPoints', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                </FormSection>
              </div>
            )}

            {/* Step: Rules */}
            {formStep === 4 && (
              <div className="space-y-5">
                <FormSection title="Content Rules">
                  <FormField label="Must-Include Keywords">
                    <textarea
                      placeholder="Keywords or phrases that should appear in content..."
                      value={form.mustIncludeKeywords || ''}
                      onChange={(e) => updateForm('mustIncludeKeywords', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Must-Avoid Keywords">
                    <textarea
                      placeholder="Words or phrases to never use..."
                      value={form.mustAvoidKeywords || ''}
                      onChange={(e) => updateForm('mustAvoidKeywords', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Competitor URLs">
                    <textarea
                      placeholder="Competitor websites for competitive awareness..."
                      value={form.competitorUrls || ''}
                      onChange={(e) => updateForm('competitorUrls', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={inputStyle}
                    />
                  </FormField>
                </FormSection>
              </div>
            )}
          </InkCard>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <div className="flex gap-2">
              {formStep > 0 && (
                <InkButton variant="ghost" onClick={() => setFormStep(formStep - 1)}>
                  Previous
                </InkButton>
              )}
            </div>
            <div className="flex gap-2">
              {formStep < formSteps.length - 1 ? (
                <InkButton variant="primary" onClick={() => setFormStep(formStep + 1)}>
                  Next
                </InkButton>
              ) : (
                <InkButton variant="primary" loading={saving} onClick={handleSave}>
                  {editingId ? 'Update Profile' : 'Create Profile'}
                </InkButton>
              )}
            </div>
          </div>

          {/* Save on any step hint */}
          <p
            className="text-center text-xs mt-4"
            style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
          >
            All fields except profile name and company name are optional.
            {formStep < formSteps.length - 1 && (
              <button
                onClick={handleSave}
                className="ml-1 underline"
                style={{ color: tokens.colors.ink[500] }}
              >
                Save now and fill the rest later
              </button>
            )}
          </p>
        </div>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div className="min-h-screen" style={{ background: tokens.colors.paper.cream }}>
      {/* Background wash */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${tokens.colors.ink[400]} 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${tokens.colors.sage[400]} 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
              style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.ink[500]} strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Company Profiles
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-light"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              Brand Profiles
            </h1>
            <p
              className="text-sm mt-2"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Save company info to auto-fill across all content pipelines
            </p>
          </div>
          <InkButton variant="primary" onClick={handleCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Profile
          </InkButton>
        </header>

        {/* Messages */}
        {success && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[200]}` }}
          >
            <p style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans, fontSize: '0.875rem' }}>{success}</p>
          </div>
        )}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: tokens.colors.ink[50], border: `1px solid ${tokens.colors.ink[200]}` }}
          >
            <p style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans, fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
              style={{ borderColor: tokens.colors.paper.border, borderTopColor: tokens.colors.ink[700] }}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && profiles.length === 0 && (
          <InkCard variant="outlined" padding="xl">
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: tokens.colors.paper.warm }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2
                className="text-xl font-light mb-2"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Create your first company profile
              </h2>
              <p
                className="text-sm mb-6 max-w-md mx-auto"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Profiles save you time by auto-filling company info, audience, brand voice, and goals across all content types.
              </p>
              <InkButton variant="primary" onClick={handleCreate}>
                Create Profile
              </InkButton>
            </div>
          </InkCard>
        )}

        {/* Profile Cards */}
        {!loading && profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profiles.map((profile) => {
              const score = getCompletenessScore(profile)
              return (
                <InkCard key={profile.id} variant="elevated" padding="lg" hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="font-medium truncate"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {profile.companyName}
                        </h3>
                        {profile.isDefault && (
                          <InkBadge variant="sage" size="sm">Default</InkBadge>
                        )}
                      </div>
                      <p
                        className="text-sm truncate"
                        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        {profile.name}
                      </p>
                    </div>
                    <CompletenessRing score={score} />
                  </div>

                  {/* Info snippets */}
                  <div className="space-y-2 mb-4">
                    {profile.industry && (
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.subtle} strokeWidth="1.5">
                          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                        </svg>
                        <span className="text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                          {profile.industry}
                        </span>
                      </div>
                    )}
                    {profile.primaryAudience && (
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.subtle} strokeWidth="1.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="text-sm truncate" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                          {profile.primaryAudience.length > 60
                            ? profile.primaryAudience.slice(0, 60) + '...'
                            : profile.primaryAudience}
                        </span>
                      </div>
                    )}
                    {profile._count && (
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.subtle} strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                          Used in {profile._count.projects} project{profile._count.projects !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-2 pt-4 border-t flex-wrap"
                    style={{ borderColor: tokens.colors.paper.border }}
                  >
                    <button
                      onClick={() => handleEdit(profile)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{ color: tokens.colors.ink[700], background: tokens.colors.ink[50], fontFamily: tokens.fonts.sans }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(profile)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{ color: tokens.colors.text.secondary, background: tokens.colors.paper.warm, fontFamily: tokens.fonts.sans }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Duplicate
                    </button>
                    {!profile.isDefault && (
                      <button
                        onClick={() => handleSetDefault(profile.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                        style={{ color: tokens.colors.sage[700], background: tokens.colors.sage[50], fontFamily: tokens.fonts.sans }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Set Default
                      </button>
                    )}
                    <div className="flex-1" />
                    {deleteConfirm === profile.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: tokens.colors.text.muted }}>Delete?</span>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="px-3 py-1.5 rounded-lg text-sm text-red-600 bg-red-50 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                          style={{ color: tokens.colors.text.muted }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(profile.id)}
                        className="p-1.5 rounded-lg text-sm transition-colors hover:bg-red-50"
                        style={{ color: tokens.colors.text.subtle }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </InkCard>
              )
            })}

            {/* Add New Card */}
            <button
              onClick={handleCreate}
              className="rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all hover:border-solid min-h-[200px]"
              style={{
                borderColor: tokens.colors.paper.border,
                background: 'transparent',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: tokens.colors.paper.warm }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.text.muted} strokeWidth="1.5">
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Add Another Profile
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
