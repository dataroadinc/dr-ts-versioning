# dr-ts-versioning

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
  `base+count` (e.g., `1.0.0+5`)
- **Feature Branches**: When on other branches, versions follow the pattern
  `base-branch+count` (e.g., `1.0.0-feature-branch+3`)
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

```bash
pnpm add dr-ts-versioning
```

## Usage

### As a CLI tool

```bash
# Update package version based on conventional commits
npx dr-ts-versioning update-package-version

# Generate changelog
npx dr-ts-versioning generate-changelog

# Get current version
npx dr-ts-versioning current-version

# Get next patch version
npx dr-ts-versioning next-patch-version
```

### As a library

```typescript
import {
  getCurrentVersion,
  getNextPatchVersion,
  generateChangelog,
} from "dr-ts-versioning"

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

This repository uses its own versioning tool for managing releases. The
following scripts are available:

### Version Management Scripts

```bash
# Get current version (updates package.json)
pnpm version:current

# Get next patch version
pnpm version:next

# Generate changelog and update current version
pnpm version:release
```

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

## License

MIT
