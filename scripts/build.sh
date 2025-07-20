#!/bin/bash

# Transparent Transaction Ledger - Build Script

set -e

echo "🔨 Building Transparent Transaction Ledger..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
pnpm clean

# Build shared packages first
echo "📦 Building shared packages..."
pnpm build --filter=@ttl/shared

# Build all applications
echo "🏗️ Building applications..."
pnpm build --filter=@ttl/web --filter=@ttl/api

# Build smart contracts
echo "⛓️ Building smart contracts..."
cd contracts
if command -v clarinet &> /dev/null; then
    clarinet check
    echo "✅ Smart contracts validated"
else
    echo "⚠️ Clarinet not found, skipping smart contract build"
fi
cd ..

# Run type checking
echo "🔍 Running type checks..."
pnpm type-check

# Run linting
echo "🧹 Running linter..."
pnpm lint

echo ""
echo "✅ Build complete!"
echo ""
echo "Built artifacts:"
echo "- Frontend: apps/web/.next/"
echo "- Backend: apps/api/dist/"
echo "- Shared: packages/shared/dist/"
echo ""
