# @dataroadinc/versioning

[![npm version](https://img.shields.io/npm/v/@dataroadinc/versioning.svg)](https://www.npmjs.com/package/@dataroadinc/versioning)
[![npm downloads](https://img.shields.io/npm/dm/@dataroadinc/versioning.svg)](https://www.npmjs.com/package/@dataroadinc/versioning)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/dataroadinc/dr-ts-versioning/workflows/CI/badge.svg)](https://github.com/dataroadinc/dr-ts-versioning/actions?query=workflow%3ACI)
[![Release](https://github.com/dataroadinc/dr-ts-versioning/actions/workflows/release.yml/badge.svg)](https://github.com/dataroadinc/dr-ts-versioning/actions/workflows/release.yml)
[![Node.js Version](https://img.shields.io/node/v/@dataroadinc/versioning)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.10.0-orange.svg)](https://pnpm.io/)

Reusable versioning and changelog utilities for monorepos and CI environments.

## Features

- Stateless and patch version calculation
- Automated changelog generation grouped by scope/type
- Designed for use in CI/CD pipelines and release workflows
- TypeScript support with full type definitions

## Opinionated Assumptions & Conventions

This library makes several opinionated assumptions about your project structure
and conventions:

### Git Conventions

- **Branch Naming**: The main branch should be named `main` (not `master`)
- **Tag Format**: Git tags should be prefixed with `v` (e.g., `v1.0.0`)
- **Conventional Commits**: Commits should follow the
  [Conventional Commits](https://www.conventionalcommits.org/) specification

### Commit Type Labels

The changelog generator uses predefined labels for commit types:

```typescript
const TYPE_LABELS = {
  feat: "Features",
  docs: "Documentation",
  content: "Content",
  partners: "Partners",
  test: "Tests",
  build: "Build System",
  deps: "Dependencies",
  style: "Style",
  perf: "Performance",
}
```

### Ignored Commit Types

The following commit types are automatically excluded from changelog generation:

- `fix` - Bug fixes (typically handled by your release automation)
- `chore` - Maintenance tasks
- `refactor` - Code refactoring

### Version Calculation Logic

- **Main Branch**: When on `main` branch, versions follow the pattern
  `base-count` (e.g., `1.0.0-5`)
- **Feature Branches**: When on other branches, versions follow the pattern
  `base-branch-count` (e.g., `1.0.0-feature-branch-3`)
- **No Tags**: If no git tags exist, falls back to `package.json` version
- **Patch Increment**: `getNextPatchVersion()` always increments the patch
  number

### File Structure Assumptions

- **Package.json**: Must exist in the current working directory
- **Git Repository**: Must be a git repository with proper history
- **Working Directory**: All operations assume they're run from the project root

### Changelog Format

Generated changelogs follow this structure:

```markdown
# Changelog

## v1.0.1 (2024-01-15)

### Features

**Features:**

- Add new API endpoint ([abc1234](https://github.com/owner/repo/commit/abc1234))

### Documentation

**Documentation:**

- Update README with new examples
  ([def5678](https://github.com/owner/repo/commit/def5678))
```

## Installation

> **Recommended:** Install as a devDependency unless you need to use this
> package at runtime in your application code.

### pnpm

```bash
pnpm add -D @dataroadinc/versioning   # devDependency (recommended)
# or, if you need it at runtime:
pnpm add @dataroadinc/versioning
```

### npm

```bash
npm install --save-dev @dataroadinc/versioning   # devDependency (recommended)
# or, if you need it at runtime:
npm install @dataroadinc/versioning
```

### yarn

```bash
yarn add --dev @dataroadinc/versioning   # devDependency (recommended)
# or, if you need it at runtime:
yarn add @dataroadinc/versioning
```

> **Use as a devDependency** if you only use the CLI or scripts in CI/CD, not in
> your app's runtime code. If you import it in your application code, use a
> regular dependency.

## Usage

### As a CLI tool

```bash
# Update package version based on conventional commits
npx @dataroadinc/versioning update-package-version

# Generate changelog
npx @dataroadinc/versioning generate-changelog

# Get current version
npx @dataroadinc/versioning current-version

# Get next patch version
npx @dataroadinc/versioning next-patch-version

```

### As a library

```typescript
import {
  getCurrentVersion,
  getNextPatchVersion,
  generateChangelog,
} from "@dataroadinc/versioning"

// Get current version from package.json
const currentVersion = getCurrentVersion()

// Calculate next patch version
const nextVersion = getNextPatchVersion()

// Generate changelog
const changelog = generateChangelog()
```

## API Reference

### `getCurrentVersion()`

Returns the current version from package.json.

### `getNextPatchVersion()`

Calculates the next patch version based on conventional commits since the last
tag.

### `generateChangelog()`

Generates a changelog grouped by commit type and scope.

### `updatePackageVersion()`

Updates the version in package.json and creates a new git tag.

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm test

# Watch mode for development
pnpm run dev

```

## Self-Versioning

This repository uses its own versioning tool for managing releases with a
**stateless versioning approach**. This means:

- **Version Calculation**: Versions are calculated dynamically from git history
- **No Git Storage**: Version numbers are not stored in package.json (optional
  updates only)
- **CI/CD Integration**: Real versions are calculated at build time in GitHub
  Actions
- **Automatic Releases**: Merging PRs to main triggers automatic versioning and
  publishing

The following scripts are available:

### Version Management Scripts

```bash
# Get current version (optionally updates package.json)
pnpm version:current

# Get next patch version
pnpm version:next

# Generate changelog and update current version
pnpm version:release

```

**Note**: The `version:current` command can optionally update package.json with
the current version. This is useful when you want to update the version in git,
but it's not required for stateless versioning. The real version will be
calculated at build time in CI/CD.

### CLI Tools

```bash
# Update package version based on git history
pnpm update-package-version

# Generate changelog from conventional commits
pnpm generate-changelog

# Get next patch version (for CI/CD)
pnpm next-patch-version

```

### Versioning Workflow

1. **Development**: Make commits following conventional commit format
2. **Current Version**: Run `pnpm version:current` to see current version
   (optional)
3. **Release**: Create a PR and merge to main
4. **Automated Release**: The release workflow will:
   - Generate changelog
   - Calculate next version
   - Create git tag
   - Create GitHub release
   - Publish to npm

### Example Workflow

```bash
# Make some changes and commit
git commit -m "feat(api): add new endpoint"

# Push to a feature branch and create PR
git push origin feature-branch

# After PR is merged to main, the release workflow will:
# - Generate CHANGELOG.md
# - Create git tag (e.g., v0.0.2)
# - Create GitHub release
# - Publish to npm automatically

```

## Breaking Changes

### v0.0.2 - Version Format Migration

**⚠️ Breaking Change**: The version format has been changed from `+N` (build
metadata) to `-N` (pre-release) format.

**Why this change was necessary:**

- npm strips `+N` build metadata during publish, causing version conflicts
- The `-N` format is preserved by npm and is Semantic Versioning compliant
- This ensures pre-release versions are properly published without conflicts

**Migration for consumers:**

- Update any version parsing logic to expect `-N` instead of `+N`
- Update CI/CD pipelines that parse version strings
- Examples: `0.0.2+3` → `0.0.2-3`

## License

MIT
