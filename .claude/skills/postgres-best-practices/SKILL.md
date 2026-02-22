---
name: supabase-postgres-best-practices
description: Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.
license: MIT
metadata:
  author: supabase
  version: "1.1.0"
  organization: Supabase
  date: January 2026
  abstract: Comprehensive Postgres performance optimization guide for developers using Supabase and Postgres. Contains performance rules across 8 categories, prioritized by impact from critical (query performance, connection management) to incremental (advanced features). Each rule includes detailed explanations, incorrect vs. correct SQL examples, query plan analysis, and specific performance metrics to guide automated optimization and code generation.
---

# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact to guide automated query optimization and schema design.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security (RLS)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## Key Rules

### Query Performance (CRITICAL)

- **Use proper indexes** - Add indexes for WHERE clauses, JOIN conditions, and ORDER BY columns
- **Avoid SELECT \*** - Select only needed columns to reduce I/O and memory
- **Use EXPLAIN ANALYZE** - Always check query plans for sequential scans on large tables
- **Parameterize queries** - Use prepared statements to avoid SQL injection and enable plan caching
- **Limit result sets** - Use LIMIT/OFFSET or cursor-based pagination

### Connection Management (CRITICAL)

- **Use connection pooling** - Configure PgBouncer or Supabase connection pooling
- **Close connections promptly** - Don't hold connections during long operations
- **Set appropriate pool sizes** - Balance between concurrency and resource usage
- **Use transaction pooling mode** - For serverless/edge functions

### Security & RLS (CRITICAL)

- **Enable RLS on all tables** - Never expose tables without row-level security
- **Use service role key server-side only** - Never expose in client code
- **Create specific policies** - Avoid overly permissive RLS policies
- **Validate inputs** - Even with RLS, validate data at the application layer

### Schema Design (HIGH)

- **Use appropriate data types** - Don't store numbers as text, use timestamptz not timestamp
- **Add foreign key constraints** - Enforce referential integrity at the database level
- **Use partial indexes** - Index only the rows you query (e.g., WHERE active = true)
- **Normalize appropriately** - Balance normalization with query performance
- **Use JSONB sparingly** - Prefer columns for frequently queried fields

### Concurrency & Locking (MEDIUM-HIGH)

- **Use advisory locks** - For application-level locking patterns
- **Keep transactions short** - Long transactions hold locks and block others
- **Use SKIP LOCKED** - For queue-like patterns to avoid contention
- **Handle deadlocks** - Design transactions to acquire locks in consistent order

### Data Access Patterns (MEDIUM)

- **Use batch operations** - INSERT/UPDATE multiple rows in single statements
- **Implement cursor pagination** - More efficient than OFFSET for large datasets
- **Use materialized views** - For expensive aggregations that don't need real-time data
- **Consider read replicas** - Offload read-heavy workloads

### Monitoring & Diagnostics (LOW-MEDIUM)

- **Monitor slow queries** - Use pg_stat_statements to identify bottlenecks
- **Track index usage** - Remove unused indexes that slow down writes
- **Monitor connection counts** - Alert before hitting connection limits
- **Use VACUUM ANALYZE** - Keep statistics up to date for the query planner

### Advanced Features (LOW)

- **Use CTEs wisely** - CTEs are optimization fences in older Postgres versions
- **Leverage GENERATED columns** - For computed values that need indexing
- **Use pg_trgm for fuzzy search** - More efficient than LIKE '%term%'
- **Consider partitioning** - For very large tables (100M+ rows)

## References

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security
