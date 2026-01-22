Claude Code Configuration for Scribengine

🚨 CRITICAL: TESTING PROTOCOL - MUST ASK ABOUT PIPELINE TESTS
================================================================================
When running tests, ALWAYS ask the user:
"Do you want to run pipeline tests too? They make real API calls and cost money."

- `npm run test:run` - Regular tests (free, fast) - RUN BY DEFAULT
- `npm run test:pipelines` - Pipeline tests (COSTS MONEY, slow) - ASK FIRST

NEVER run pipeline tests without explicit user confirmation.
Pipeline tests call real OpenAI/Anthropic APIs and incur charges.
================================================================================

🚨 CRITICAL: JAVASCRIPT PARALLEL EXECUTION PATTERNS
MANDATORY RULE: JavaScript projects require Node.js ecosystem coordination with npm/yarn parallel operations.

🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL JAVASCRIPT OPERATIONS
ABSOLUTE RULE: ALL JavaScript operations MUST be concurrent/parallel in a single message:

🔴 MANDATORY CONCURRENT PATTERNS FOR JAVASCRIPT:
Package Management: ALWAYS batch ALL npm/yarn commands in ONE message
File Operations: ALWAYS batch ALL JS/JSON file operations together
Testing: ALWAYS run ALL test suites in parallel
Build Operations: ALWAYS batch ALL build/bundle/deploy operations
Development Server: ALWAYS start dev server WITH other operations
⚡ JAVASCRIPT GOLDEN RULE: "1 MESSAGE = ALL NODE.JS OPERATIONS"
Examples of CORRECT JavaScript concurrent execution:

// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all Node.js tasks] }
  - Task("You are Node.js architect. Coordinate via hooks for API design...")
  - Task("You are Frontend developer. Coordinate via hooks for UI components...")
  - Task("You are DevOps engineer. Coordinate via hooks for deployment...")
  - Bash("npm init -y")
  - Bash("npm install express mongoose cors helmet")
  - Bash("npm install --save-dev jest supertest nodemon eslint")
  - Write("package.json", packageContent)
  - Write("server.js", serverContent)
  - Write("routes/api.js", routesContent)
  - Write("middleware/auth.js", authContent)
  - Write("tests/api.test.js", testContent)
  - Write(".eslintrc.js", eslintConfig)
  - Write(".gitignore", gitignoreContent)
🎯 JAVASCRIPT-SPECIFIC SWARM PATTERNS
📦 Node.js Package Management Coordination
Package Installation Strategy:

# Always batch dependency installations
npm install express mongoose cors helmet jsonwebtoken bcryptjs
npm install --save-dev jest supertest nodemon eslint prettier husky
npm install --global pm2 # for production
Parallel Development Setup:

// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("npm init -y")
  - Bash("npm install express mongoose cors helmet dotenv")
  - Bash("npm install --save-dev jest nodemon eslint prettier")
  - Write("package.json", updatedPackageJson)
  - Write("server.js", expressServer)
  - Write(".env.example", envTemplate)
  - Write("nodemon.json", nodemonConfig)
  - Write(".eslintrc.js", eslintConfig)
  - Bash("npm run dev & npm run test")
🏗️ JavaScript Agent Specialization
Agent Types for JavaScript Projects:

Backend API Agent - Express.js, FastAPI, database integration
Frontend Logic Agent - Vanilla JS, DOM manipulation, async patterns
Testing Agent - Jest, Mocha, integration testing
Build Agent - Webpack, Rollup, Vite configuration
DevOps Agent - PM2, Docker, deployment automation
🧪 JavaScript Testing Coordination
Parallel Testing Strategy:

// Test coordination pattern
[BatchTool]:
  - Write("tests/unit/auth.test.js", unitTests)
  - Write("tests/integration/api.test.js", integrationTests)
  - Write("tests/e2e/user-flow.test.js", e2eTests)
  - Write("jest.config.js", jestConfig)
  - Bash("npm test -- --coverage --watchAll=false")
  - Bash("npm run test:integration")
  - Bash("npm run test:e2e")
⚡ Performance Optimization Patterns
JavaScript Performance Coordination:

// Performance optimization batch
[BatchTool]:
  - Write("middleware/compression.js", compressionMiddleware)
  - Write("utils/cache.js", cacheUtilities)
  - Write("config/database.js", dbOptimization)
  - Bash("npm install compression redis cluster")
  - Bash("npm run build:production")
  - Bash("npm run analyze:bundle")
📋 JAVASCRIPT PROJECT TEMPLATES
🌐 Express.js API Template
Swarm Initialization for Express API:

// Initialize Express API swarm
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 6,
  strategy: "parallel"
})

// Spawn specialized agents
mcp__claude-flow__agent_spawn({ type: "architect", name: "API Designer" })
mcp__claude-flow__agent_spawn({ type: "coder", name: "Express Developer" })
mcp__claude-flow__agent_spawn({ type: "coder", name: "Database Expert" })
mcp__claude-flow__agent_spawn({ type: "tester", name: "API Tester" })
mcp__claude-flow__agent_spawn({ type: "reviewer", name: "Security Auditor" })
mcp__claude-flow__agent_spawn({ type: "coordinator", name: "DevOps Lead" })
Express.js Project Structure:

project/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── config/
├── docs/
└── scripts/
🎨 Frontend JavaScript Template
Frontend Development Coordination:

// Frontend-focused swarm
[BatchTool]:
  - Write("src/js/main.js", mainAppLogic)
  - Write("src/js/components/header.js", headerComponent)
  - Write("src/js/services/api.js", apiService)
  - Write("src/js/utils/helpers.js", utilityFunctions)
  - Write("src/css/styles.css", mainStyles)
  - Write("index.html", htmlTemplate)
  - Bash("npm install webpack webpack-cli webpack-dev-server")
  - Bash("npm run build && npm run dev")
🔧 JAVASCRIPT BUILD TOOLS COORDINATION
📦 Webpack Configuration
Webpack Swarm Pattern:

// Webpack build optimization
[BatchTool]:
  - Write("webpack.config.js", webpackConfig)
  - Write("webpack.prod.js", productionConfig)
  - Write("webpack.dev.js", developmentConfig)
  - Bash("npm install webpack-bundle-analyzer terser-webpack-plugin")
  - Bash("npm run build:analyze")
  - Bash("npm run build:production")
🎯 Modern JavaScript (ES6+) Patterns
ES6+ Development Coordination:

// Modern JavaScript features batch
[BatchTool]:
  - Write("src/modules/async-operations.js", asyncAwaitPatterns)
  - Write("src/modules/destructuring.js", destructuringExamples)
  - Write("src/modules/classes.js", classDefinitions)
  - Write("src/modules/modules.js", esModulePatterns)
  - Write("babel.config.js", babelConfiguration)
  - Bash("npm install @babel/core @babel/preset-env")
🔒 JAVASCRIPT SECURITY BEST PRACTICES
🛡️ Security Coordination Patterns
Security Implementation Batch:

[BatchTool]:
  - Write("middleware/security.js", securityMiddleware)
  - Write("utils/validation.js", inputValidation)
  - Write("utils/sanitization.js", dataSanitization)
  - Bash("npm install helmet joi bcryptjs jsonwebtoken")
  - Bash("npm install --save-dev eslint-plugin-security")
  - Bash("npm audit fix")
Security Checklist for JavaScript:

Input validation and sanitization
SQL injection prevention
XSS protection
CSRF tokens
Rate limiting
Secure headers (Helmet.js)
Environment variable protection
Dependency vulnerability scanning
📊 JAVASCRIPT MONITORING AND LOGGING
📈 Performance Monitoring
Monitoring Setup Coordination:

[BatchTool]:
  - Write("utils/logger.js", winstonLogger)
  - Write("middleware/metrics.js", performanceMetrics)
  - Write("config/monitoring.js", monitoringConfig)
  - Bash("npm install winston pino express-rate-limit")
  - Bash("npm install --save-dev clinic autocannon")
🚀 JAVASCRIPT DEPLOYMENT PATTERNS
⚙️ Production Deployment
Deployment Coordination:

[BatchTool]:
  - Write("Dockerfile", dockerConfiguration)
  - Write("docker-compose.yml", dockerCompose)
  - Write("ecosystem.config.js", pm2Config)
  - Write("scripts/deploy.sh", deploymentScript)
  - Bash("npm run build:production")
  - Bash("docker build -t app:latest .")
  - Bash("npm run test:production")
🔄 JAVASCRIPT CI/CD COORDINATION
🏗️ GitHub Actions for JavaScript
CI/CD Pipeline Batch:

[BatchTool]:
  - Write(".github/workflows/ci.yml", githubActions)
  - Write(".github/workflows/deploy.yml", deploymentWorkflow)
  - Write("scripts/test.sh", testScript)
  - Write("scripts/build.sh", buildScript)
  - Bash("npm run lint && npm run test && npm run build")
💡 JAVASCRIPT BEST PRACTICES
📝 Code Quality Standards
ESLint Configuration: Enforce consistent code style
Prettier Integration: Automatic code formatting
Husky Hooks: Pre-commit quality checks
Jest Testing: Comprehensive test coverage
JSDoc Comments: Proper code documentation
Error Handling: Robust error management patterns
🎯 Performance Optimization
Async/Await: Proper asynchronous programming
Lazy Loading: Dynamic imports and code splitting
Caching Strategies: Redis, memory caching
Database Optimization: Connection pooling, indexing
Bundle Optimization: Tree shaking, minification
Memory Management: Avoiding memory leaks
📚 JAVASCRIPT LEARNING RESOURCES
🎓 Recommended Topics
Modern JavaScript: ES6+, async programming, modules
Node.js: Server-side development, npm ecosystem
Express.js: Web framework, middleware, routing
Database Integration: MongoDB, PostgreSQL, Redis
Testing: Jest, Mocha, integration testing
DevOps: Docker, PM2, deployment strategies