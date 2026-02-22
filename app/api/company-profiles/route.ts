import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/company-profiles - List all profiles for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profiles = await prisma.companyProfile.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { updatedAt: 'desc' },
      ],
      include: {
        _count: {
          select: { projects: true },
        },
      },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching company profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

// POST /api/company-profiles - Create a new profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, companyName } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 })
    }

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    // If this profile is set as default, unset other defaults
    if (body.isDefault) {
      await prisma.companyProfile.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const profile = await prisma.companyProfile.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        isDefault: body.isDefault || false,
        companyName: companyName.trim(),
        industry: body.industry?.trim() || null,
        companyDescription: body.companyDescription?.trim() || null,
        companySize: body.companySize || null,
        websiteUrl: body.websiteUrl?.trim() || null,
        brandVoice: body.brandVoice?.trim() || null,
        brandGuidelines: body.brandGuidelines?.trim() || null,
        sampleContent: body.sampleContent?.trim() || null,
        brandColors: body.brandColors || null,
        emojiPreference: body.emojiPreference || null,
        controversyLevel: body.controversyLevel || null,
        primaryAudience: body.primaryAudience?.trim() || null,
        secondaryAudiences: body.secondaryAudiences?.trim() || null,
        audiencePainPoints: body.audiencePainPoints?.trim() || null,
        audienceAspirations: body.audienceAspirations?.trim() || null,
        primaryGoals: body.primaryGoals?.trim() || null,
        keyMessages: body.keyMessages?.trim() || null,
        uniqueSellingPoints: body.uniqueSellingPoints?.trim() || null,
        mustIncludeKeywords: body.mustIncludeKeywords?.trim() || null,
        mustAvoidKeywords: body.mustAvoidKeywords?.trim() || null,
        competitorUrls: body.competitorUrls?.trim() || null,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating company profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
