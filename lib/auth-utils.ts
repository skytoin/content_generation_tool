import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

// Get current session (for server components and API routes)
export async function getSession() {
  return await getServerSession(authOptions)
}

// Get current user with full database info
export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  return user
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

// Get user ID from session (throws if not authenticated)
export async function requireUserId(): Promise<string> {
  const session = await requireAuth()

  if (!session.user.id) {
    // If somehow we have a session but no ID, fetch from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!user) {
      redirect('/login')
    }
    return user.id
  }

  return session.user.id
}
