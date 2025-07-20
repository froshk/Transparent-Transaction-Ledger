#!/bin/bash

# Transparent Transaction Ledger - Development Setup Script

set -e

echo "🚀 Setting up Transparent Transaction Ledger development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment files
echo "⚙️ Setting up environment files..."

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
fi

if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env"
fi

# Check if PostgreSQL is running (optional)
if command -v psql &> /dev/null; then
    echo "🗄️ PostgreSQL detected. Make sure it's running and configured."
else
    echo "⚠️ PostgreSQL not detected. You'll need to install and configure it for the API."
fi

# Check if Clarinet is installed (for smart contracts)
if ! command -v clarinet &> /dev/null; then
    echo "⚠️ Clarinet not detected. Install it for smart contract development:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "   cargo install clarinet-cli"
fi

# Build shared packages
echo "🔨 Building shared packages..."
pnpm build --filter=@ttl/shared

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env files"
echo "2. Set up PostgreSQL database"
echo "3. Run 'pnpm dev' to start development servers"
echo "4. Visit http://localhost:3000 for the frontend"
echo "5. Visit http://localhost:3001/api for API documentation"
echo ""
echo "Happy coding! 🎉"
