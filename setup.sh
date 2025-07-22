#!/bin/bash

# Setup script for dr-ts-versioning repository

echo "Setting up dr-ts-versioning repository..."

# Initialize git repository
git init

# Install dependencies
pnpm install

# Setup husky
pnpm run prepare

# Build the package
pnpm run build

# Run tests
pnpm test

# Run linting
pnpm lint

# Check formatting
pnpm format:check

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/dataroadinc/dr-ts-versioning"
echo "2. Add the remote origin: git remote add origin https://github.com/dataroadinc/dr-ts-versioning.git"
echo "3. Make initial commit: git add . && git commit -m 'feat: initial release'"
echo "4. Push to GitHub: git push -u origin main"
echo "5. Set up NPM_TOKEN secret in GitHub repository settings"
echo "6. Publish to npm: pnpm publish" 