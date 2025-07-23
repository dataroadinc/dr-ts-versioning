# Development Guide

This guide covers the development setup and workflow for the
`@dataroadinc/versioning` project.

## Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10.0.0
- Git

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd dr-ts-versioning

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

```

## Development Commands

```bash
# Build for production
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint markdown files
pnpm lint:md

# Fix markdown formatting
pnpm fix:md

```

## Project Structure

```

src/
├── index.ts                    # Main entry point
├── current-version.ts          # Current version detection
├── next-patch-version.ts       # Next patch version calculation
├── update-package-version.ts   # Package version update
├── generate-changelog.ts       # Changelog generation
├── version-utils.ts            # Version utility functions
└── index.test.ts               # Test suite

```

## Versioning Commands

The package provides several CLI commands for version management:

- `update-package-version` - Update package.json version based on conventional
  commits
- `next-patch-version` - Calculate the next patch version
- `generate-changelog` - Generate changelog from conventional commits

## Testing

The project uses Vitest for testing:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test src/index.test.ts

```

## Code Quality

### Linting

ESLint is configured with TypeScript support:

```bash
# Lint all files
pnpm lint

# Lint specific files
pnpm lint src/

```

### Formatting

Prettier ensures consistent code formatting:

```bash
# Format all files
pnpm format

# Check formatting without changes
pnpm format:check

```

### Markdown Linting

Markdown files are linted for consistency:

```bash
# Lint markdown files
pnpm lint:md

# Fix markdown formatting issues
pnpm fix:md

```

## Git Workflow

### Conventional Commits

This project uses conventional commits for versioning:

```bash
# Feature
git commit -m "feat(versioning): add next patch version calculation"

# Bug fix
git commit -m "fix(changelog): resolve version detection issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

```

### Pre-commit Hooks

Husky runs pre-commit checks:

- Prettier formatting
- ESLint linting
- Commit message validation

## Available Scripts

- `build` - Build the TypeScript project
- `dev` - Build in watch mode
- `clean` - Remove build artifacts
- `test` - Run test suite
- `test:watch` - Run tests in watch mode
- `lint` - Lint TypeScript files
- `lint:md` - Lint markdown files
- `fix:md` - Fix markdown formatting
- `format` - Format code with Prettier
- `format:check` - Check code formatting
- `version:current` - Update current version
- `version:next` - Calculate next version
- `version:release` - Generate changelog and update version

## Troubleshooting

### Common Issues

1. **Path mapping errors**: Ensure you're using the correct TypeScript
   configuration
2. **Formatting conflicts**: Run `pnpm format` to resolve formatting issues
3. **Linting errors**: Run `pnpm lint` to identify and fix linting issues
4. **Test failures**: Check that all dependencies are installed with
   `pnpm install`

### Getting Help

- Check the [formatting guide](formatting.md) for code formatting setup
- Check the [versioning system guide](versioning-system.md) for version
  management
- Review the [API reference](api-reference.md) for function documentation
- Open an issue on GitHub for bugs or feature requests
