# Scribengine Testing Guide

## Overview

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing support.

## ⚠️ IMPORTANT FOR AI AGENTS

**When running tests, ALWAYS ask the user:**
> "Do you want to run pipeline tests too? They make real API calls and cost money."

- Regular tests: `npm run test:run` (free, fast)
- Pipeline tests: `npm run test:pipelines` (costs money, slow)

**Never run pipeline tests without user confirmation.**

## Getting Started

### Running Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/build)
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run pipeline smoke tests (COSTS MONEY - ask user first!)
npm run test:pipelines
```

## Test Structure

```
tests/
├── setup.ts              # Test setup and global mocks
├── unit/                 # Unit tests for isolated functions
│   ├── pricing-config.test.ts
│   └── auth-utils.test.ts
├── integration/          # Integration tests for API routes
│   ├── projects-api.test.ts
│   └── access-control.test.ts
├── e2e/                  # End-to-end tests (future)
├── mocks/                # Mock implementations
│   ├── prisma.ts         # Prisma client mock
│   └── next-auth.ts      # NextAuth mock helpers
└── fixtures/             # Test data
    ├── users.ts          # User fixtures (admin, regular)
    └── projects.ts       # Project fixtures
```

## Test Categories

### Unit Tests (`tests/unit/`)

Test individual functions in isolation.

#### `pricing-config.test.ts`
Tests the pricing configuration module:
- `getLengthTier()` - Retrieves length tier by ID
- `getQualityTier()` - Retrieves quality tier by ID
- `getPrice()` - Calculates price for tier combination
- `formatPrice()` - Formats price for display
- `getWordCountRange()` - Gets word count limits for tier
- Default tier values

#### `auth-utils.test.ts`
Tests authentication utilities:
- `getSession()` - Gets current session
- `getCurrentUser()` - Gets full user from database
- `requireAuth()` - Requires authentication or redirects
- `requireUserId()` - Gets user ID or redirects
- `isCurrentUserAdmin()` - Checks admin status
- `requireAdmin()` - Requires admin access or throws

### Integration Tests (`tests/integration/`)

Test API route logic and access control.

#### `projects-api.test.ts`
Tests the Projects API access control:
- GET /api/projects - List projects
- GET /api/projects/[id] - Get single project
- POST /api/projects - Create project
- DELETE /api/projects/[id] - Delete project
- User isolation (users can only see their own projects)

#### `access-control.test.ts`
Tests the critical access control rules:

**Admin Access:**
- Admin users have FREE access to pipeline results
- Admin users bypass payment verification

**Regular User Access:**
- Regular users are correctly identified as non-admin
- ⚠️ TODO: Payment verification for regular users (marked as `it.todo`)

**Stripe/Resend Tests:**
- Currently skipped until services are connected
- Documents expected behavior for future implementation

## Mocking Strategy

### Prisma Mock (`tests/mocks/prisma.ts`)

```typescript
import { mockPrisma, resetPrismaMocks } from '../mocks/prisma'

// In tests:
beforeEach(() => {
  resetPrismaMocks()
})

// Mock a database call
mockPrisma.user.findUnique.mockResolvedValue(adminUser)
```

### NextAuth Mock (`tests/mocks/next-auth.ts`)

```typescript
import {
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
  mockGetServerSession,
} from '../mocks/next-auth'

// Mock authenticated user
mockAuthenticatedSession({ email: 'user@example.com' })

// Mock unauthenticated state
mockUnauthenticatedSession()

// Access the mock directly
mockGetServerSession.mockResolvedValue(customSession)
```

### Fixtures (`tests/fixtures/`)

Pre-defined test data for consistent testing:

```typescript
import { adminUser, regularUser } from '../fixtures/users'
import { completedProject, processingProject } from '../fixtures/projects'

// adminUser.isAdmin === true
// regularUser.isAdmin === false
```

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mockPrisma, resetPrismaMocks } from '../mocks/prisma'
import { mockGetServerSession, resetAuthMocks } from '../mocks/next-auth'

describe('API Route', () => {
  beforeEach(() => {
    resetPrismaMocks()
    resetAuthMocks()
  })

  it('should require authentication', async () => {
    mockGetServerSession.mockResolvedValue(null)
    // Test that unauthenticated requests are rejected
  })
})
```

## Test Configuration

### `vitest.config.ts`

Key configuration:
- **Environment:** jsdom (for React components)
- **Setup file:** `tests/setup.ts`
- **Path alias:** `@/` maps to project root
- **Coverage:** V8 provider with text, JSON, and HTML reports

### Globals

Vitest globals are enabled, so you don't need to import:
- `describe`, `it`, `test`
- `expect`
- `beforeEach`, `afterEach`, `beforeAll`, `afterAll`
- `vi` (for mocking)

## Access Control Testing

### Critical Business Rules

1. **Admin users** have FREE access to all pipelines
2. **Regular users** must pay before accessing pipeline results
3. **Only the project owner** can access their projects

### Testing Admin vs Regular User

```typescript
// Admin user test
mockAuthenticatedSession({ email: adminUser.email })
mockPrisma.user.findUnique.mockResolvedValue(adminUser)
const user = await mockPrisma.user.findUnique({ where: { email: adminUser.email } })
expect(user?.isAdmin).toBe(true)

// Regular user test
mockAuthenticatedSession({ email: regularUser.email })
mockPrisma.user.findUnique.mockResolvedValue(regularUser)
const user = await mockPrisma.user.findUnique({ where: { email: regularUser.email } })
expect(user?.isAdmin).toBe(false)
```

## TODO Tests

Tests marked with `it.todo()` document expected behavior that needs implementation:

- `regular user should NOT have free access to generate API` - Payment verification needed
- `regular user should NOT access results without payment` - Access control implementation
- `regular user should access results after completing payment` - Post-payment access

## Skipped Tests

Tests in `describe.skip()` blocks are for services not yet connected:

- **Stripe Payment Verification** - Waiting for Stripe connection
- **Resend Email Delivery** - Waiting for Resend connection

These tests will be enabled when the services are connected.

## Pipeline Smoke Tests

Pipeline tests verify that the AI content generation actually works by making **real API calls**.

### Location
`tests/e2e/pipelines.test.ts`

### What They Test
- **Budget Pipeline** - OpenAI models only
- **Standard Pipeline** - OpenAI + Claude Sonnet
- **Premium Pipeline** - Full Claude pipeline (Haiku → Sonnet → Opus)
- **Error Handling** - Authentication and validation

### Running Pipeline Tests

```bash
npm run test:pipelines
```

### ⚠️ Costs and Timing
- **Budget tier:** ~$0.02-0.05 per test
- **Standard tier:** ~$0.05-0.10 per test
- **Premium tier:** ~$0.20-0.50 per test
- **Time:** 30 seconds to 5 minutes per pipeline

### When to Run
- Before major releases
- After changing pipeline code
- When debugging API integration issues
- **NOT** on every commit or PR

### Requirements
- Dev server running (`npm run dev`)
- Valid API keys in `.env.local`
- User must be logged in as admin for full tests

## Coverage

Run `npm run test:coverage` to generate coverage reports.

Coverage reports are generated in:
- Terminal (text summary)
- `coverage/` directory (HTML report)
- `coverage/coverage.json` (JSON for CI)

## Continuous Integration

For CI environments:

```bash
npm run test:run
```

This runs tests once and exits with appropriate exit code.

## Troubleshooting

### Tests not finding imports

Ensure the `@/` path alias is working:
```typescript
// vitest.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './'),
  },
},
```

### Mocks not resetting

Always call reset functions in `beforeEach`:
```typescript
beforeEach(() => {
  resetPrismaMocks()
  resetAuthMocks()
})
```

### Async issues

Use `async/await` properly:
```typescript
it('should work', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```
