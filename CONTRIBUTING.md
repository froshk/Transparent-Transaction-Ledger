# Contributing to Transparent Transaction Ledger

Thank you for your interest in contributing to the Transparent Transaction Ledger! This document provides guidelines and information for contributors.

## Development Setup

1. **Prerequisites**
   - Node.js 18+ 
   - pnpm 8+
   - PostgreSQL 14+
   - Git

2. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd transparent-transaction-ledger
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Environment Configuration**
   - Copy `.env.example` files and configure your local environment
   - Set up PostgreSQL database
   - Configure Stacks blockchain connection

## Project Structure

```
transparent-transaction-ledger/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── ui/           # Shared UI components
├── contracts/        # Clarity smart contracts
├── docs/            # Project documentation
└── scripts/         # Development scripts
```

## Development Workflow

### 1. Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### 2. Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add user authentication
fix(api): resolve database connection issue
docs(readme): update setup instructions
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### 3. Pull Request Process
1. Create a feature branch from `develop`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `pnpm test`
4. Run linting: `pnpm lint`
5. Update documentation if needed
6. Submit PR with clear description

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type usage
- Use meaningful variable and function names

### React/Next.js
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript for props and state

### NestJS/Backend
- Follow NestJS architectural patterns
- Use DTOs for data validation
- Implement proper error handling
- Write comprehensive API documentation

### Smart Contracts (Clarity)
- Follow Clarity best practices
- Include comprehensive tests
- Document all public functions
- Implement proper error handling

## Testing

### Frontend Testing
```bash
cd apps/web
pnpm test
```

### Backend Testing
```bash
cd apps/api
pnpm test
pnpm test:e2e
```

### Smart Contract Testing
```bash
cd contracts
clarinet test
```

## Code Quality

### Linting and Formatting
```bash
pnpm lint          # Run ESLint
pnpm format        # Run Prettier
```

### Type Checking
```bash
pnpm type-check    # TypeScript type checking
```

## Documentation

- Update README.md for significant changes
- Document new APIs in code comments
- Update JSDoc for functions and classes
- Include examples in documentation

## Security

- Never commit sensitive information
- Use environment variables for secrets
- Follow security best practices
- Report security issues privately

## Performance

- Optimize bundle sizes
- Implement proper caching strategies
- Monitor blockchain transaction costs
- Use efficient database queries

## Blockchain Development

### Smart Contracts
- Test thoroughly on testnet before mainnet
- Consider gas costs and optimization
- Implement proper access controls
- Document contract interfaces

### Integration
- Handle blockchain transaction failures gracefully
- Implement proper retry mechanisms
- Monitor transaction status
- Cache blockchain data appropriately

## Getting Help

- Check existing issues and documentation
- Ask questions in discussions
- Join our development community
- Review the codebase for examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the future of transparent real estate transactions! 🏠⛓️
