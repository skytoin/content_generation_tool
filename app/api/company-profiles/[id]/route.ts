import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/company-profiles/[id] - Get a single profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const profile = await prisma.companyProfile.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching company profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH /api/company-profiles/[id] - Update a profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.companyProfile.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await req.json()

    // If setting as default, unset other defaults first
    if (body.isDefault && !existing.isDefault) {
      await prisma.companyProfile.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updatableFields = [
      'name', 'companyName', 'isDefault', 'industry', 'companyDescription',
      'companySize', 'websiteUrl', 'brandVoice', 'brandGuidelines',
      'sampleContent', 'brandColors', 'emojiPreference', 'controversyLevel',
      'primaryAudience', 'secondaryAudiences', 'audiencePainPoints',
      'audienceAspirations', 'primaryGoals', 'keyMessages',
      'uniqueSellingPoints', 'mustIncludeKeywords', 'mustAvoidKeywords',
      'competitorUrls',
    ]

    const data: Record<string, any> = {}
    for (const field of updatableFields) {
      if (field in body) {
        if (field === 'brandColors' || field === 'isDefault') {
          data[field] = body[field]
        } else if (typeof body[field] === 'string') {
          data[field] = body[field].trim() || null
        } else {
          data[field] = body[field]
        }
      }
    }

    const profile = await prisma.companyProfile.update({
      where: { id },
      data,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating company profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

// DELETE /api/company-profiles/[id] - Delete a profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.companyProfile.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    await prisma.companyProfile.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company profile:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
