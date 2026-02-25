import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const timestamp = Math.round(Date.now() / 1000).toString()
  const folder = 'scribengine-blog'
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha256')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('folder', folder)
  uploadForm.append('timestamp', timestamp)
  uploadForm.append('api_key', apiKey)
  uploadForm.append('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: uploadForm }
  )

  if (!response.ok) {
    const error = await response.text()
    return NextResponse.json({ error: 'Upload failed', details: error }, { status: 500 })
  }

  const result = await response.json()

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  })
}
