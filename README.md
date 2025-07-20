# Transparent Transaction Ledger

A blockchain-powered platform revolutionizing real estate transactions through transparency, automation, and security.

## Overview

The Transparent Transaction Ledger leverages the Stacks blockchain, AI-powered compliance monitoring, and smart contract automation to create a secure, transparent, and efficient platform for residential and commercial real estate transactions. The platform addresses critical industry pain points including lack of transparency, lengthy closing times, fraud risks, and complex paperwork processes.

## Technology Stack

### Frontend
- **React 18** with **Next.js 14** for server-side rendering and static site generation
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for responsive, utility-first styling
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with **NestJS** framework for robust, scalable API architecture
- **TypeScript** for end-to-end type safety
- **PostgreSQL** for relational data management
- **Prisma** ORM for database operations

### Blockchain & Storage
- **Stacks Blockchain** for immutable transaction and title records
- **Clarity** smart contracts for automated earnest money release
- **IPFS** for decentralized document storage
- **Stacks.js** for blockchain integration

### Development & Deployment
- **Turborepo** for monorepo build orchestration
- **pnpm** for efficient package management
- **ESLint** and **Prettier** for code quality
- **Jest** and **Playwright** for comprehensive testing
- **Docker** for containerization
- **Kubernetes** for cloud-agnostic deployment

## Project Structure

```
transparent-transaction-ledger/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # NestJS backend API
├── packages/
│   ├── shared/              # Shared TypeScript types and utilities
│   └── ui/                  # Shared UI components
├── contracts/
│   ├── src/                 # Clarity smart contracts
│   └── tests/               # Smart contract tests
├── docs/                    # Project documentation
├── scripts/                 # Build and deployment scripts
└── .github/workflows/       # CI/CD workflows
```

## Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher
- **PostgreSQL** 14.x or higher
- **Docker** (optional, for containerized development)
- **Stacks CLI** for smart contract development

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transparent-transaction-ledger
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

4. **Start the development servers**
   ```bash
   pnpm dev
   ```

5. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications for production
- `pnpm test` - Run all tests across the monorepo
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all build artifacts

## Architecture Overview

The platform follows a microservices architecture with clear separation of concerns:

- **Frontend (Next.js)**: User interface for all stakeholders with real-time updates
- **Backend API (NestJS)**: RESTful API handling business logic and data management
- **Blockchain Layer**: Stacks smart contracts for immutable records and automation
- **AI Services**: Python-based services for fraud detection and compliance monitoring
- **Database**: PostgreSQL for structured data with IPFS for document storage

## Core Features

### MVP Scope
- ✅ Immutable transaction and title records on Stacks blockchain
- ✅ Smart contract automation for earnest money release
- ✅ Unified stakeholder dashboard with real-time updates
- ✅ Secure document sharing and e-signature functionality
- ✅ Basic AI-powered compliance and fraud monitoring
- ✅ Transparent communication tools for all parties

### Post-MVP Features
- Automated ownership transfer upon final payment
- Enhanced AI for comprehensive legal document generation
- Cross-jurisdictional property history access
- Advanced analytics and reporting
- Tokenization for fractional ownership

## Testing Strategy

The project implements a comprehensive testing pyramid:

- **Unit Tests**: Jest for individual component and function testing
- **Integration Tests**: API endpoint and database integration testing
- **End-to-End Tests**: Playwright for full user journey testing
- **Smart Contract Tests**: Clarity testing framework for blockchain logic

## Contributing

Please refer to our [Contributing Guidelines](CONTRIBUTING.md) for development standards, commit conventions, and pull request processes.

## Documentation

- [Product Requirements Document](docs/Product%20Requirements%20Document%20(PRD).md)
- [Project Brief](docs/Project%20Brief.md)
- [UI/UX Specification](docs/UI_UX%20Specification.md)
- [API Documentation](http://localhost:3001/api) (when running locally)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for transparent, secure, and efficient real estate transactions**
