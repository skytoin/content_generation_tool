// Test fixtures for user data

export const adminUser = {
  id: 'admin-user-id',
  email: 'admin@scribengine.io',
  name: 'Admin User',
  emailVerified: new Date(),
  image: null,
  isAdmin: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const regularUser = {
  id: 'regular-user-id',
  email: 'user@example.com',
  name: 'Regular User',
  emailVerified: new Date(),
  image: null,
  isAdmin: false,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

export const newUser = {
  id: 'new-user-id',
  email: 'newuser@example.com',
  name: 'New User',
  emailVerified: null,
  image: null,
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const adminSession = {
  user: {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

export const regularSession = {
  user: {
    id: regularUser.id,
    email: regularUser.email,
    name: regularUser.name,
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}
