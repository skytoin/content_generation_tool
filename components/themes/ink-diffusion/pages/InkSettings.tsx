'use client'

import { tokens } from '@/components/ui-concepts/ink-diffusion-system/design-tokens'
import { InkDashboardHeader } from '../InkDashboardHeader'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export function InkSettings() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings. Please try again.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <InkDashboardHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      <div className="p-6 lg:p-8 max-w-2xl">
        {message && (
          <div
            className="mb-6 p-4 rounded-lg text-sm"
            style={{
              background: message.includes('success')
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: message.includes('success') ? '#166534' : '#991b1b',
            }}
          >
            {message}
          </div>
        )}

        {/* Profile Settings */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.ink[200]}`,
          }}
        >
          <h2
            className="text-lg mb-4"
            style={{
              fontFamily: tokens.fonts.serif,
              fontWeight: 600,
              color: tokens.colors.ink[700],
            }}
          >
            Profile
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2"
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontWeight: 500,
                  color: tokens.colors.ink[600],
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg cursor-not-allowed"
                style={{
                  fontFamily: tokens.fonts.sans,
                  background: tokens.colors.paper.cream,
                  border: `1px solid ${tokens.colors.ink[200]}`,
                  color: tokens.colors.ink[400],
                }}
              />
              <p
                className="text-xs mt-1"
                style={{
                  fontFamily: tokens.fonts.sans,
                  color: tokens.colors.ink[400],
                }}
              >
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-2"
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontWeight: 500,
                  color: tokens.colors.ink[600],
                }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg transition-all"
                style={{
                  fontFamily: tokens.fonts.sans,
                  background: tokens.colors.paper.white,
                  border: `1px solid ${tokens.colors.ink[200]}`,
                  color: tokens.colors.ink[700],
                }}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.ink[200]}`,
          }}
        >
          <h2
            className="text-lg mb-4"
            style={{
              fontFamily: tokens.fonts.serif,
              fontWeight: 600,
              color: tokens.colors.ink[700],
            }}
          >
            Notifications
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    fontWeight: 500,
                    color: tokens.colors.ink[600],
                  }}
                >
                  Email notifications
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    color: tokens.colors.ink[400],
                  }}
                >
                  Receive updates about your projects
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded"
                style={{ accentColor: tokens.colors.ink[700] }}
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    fontWeight: 500,
                    color: tokens.colors.ink[600],
                  }}
                >
                  Marketing emails
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    color: tokens.colors.ink[400],
                  }}
                >
                  Tips, updates, and promotional content
                </p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 rounded"
                style={{ accentColor: tokens.colors.ink[700] }}
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className="rounded-lg p-6"
          style={{
            background: tokens.colors.paper.white,
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <h2
            className="text-lg mb-4"
            style={{
              fontFamily: tokens.fonts.serif,
              fontWeight: 600,
              color: '#dc2626',
            }}
          >
            Danger Zone
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm"
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontWeight: 500,
                  color: tokens.colors.ink[600],
                }}
              >
                Delete account
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: tokens.fonts.sans,
                  color: tokens.colors.ink[400],
                }}
              >
                Permanently delete your account and all data
              </p>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                fontFamily: tokens.fonts.sans,
                color: '#dc2626',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'transparent',
              }}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{
              fontFamily: tokens.fonts.sans,
              background: tokens.colors.ink[700],
              color: tokens.colors.paper.white,
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  )
}
