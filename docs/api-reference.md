# API Reference

This document provides comprehensive API documentation for the
`@dataroadinc/versioning` package.

## Core Functions

### `getCurrentVersion()`

Retrieves the current version from package.json.

**Returns**: `string` - The current version (e.g., "1.2.3")

**Example**:

```typescript
import { getCurrentVersion } from "@dataroadinc/versioning"

const version = getCurrentVersion()
console.log(version) // "1.2.3"
```

### `getNextPatchVersion()`

Calculates the next patch version based on conventional commits.

**Returns**: `string` - The next patch version (e.g., "1.2.4")

**Example**:

```typescript
import { getNextPatchVersion } from "@dataroadinc/versioning"

const nextVersion = getNextPatchVersion()
console.log(nextVersion) // "1.2.4"
```

### `updatePackageVersion()`

Updates the version in package.json to the next patch version.

**Returns**: `void`

**Example**:

```typescript
import { updatePackageVersion } from "@dataroadinc/versioning"

updatePackageVersion()
// Updates package.json version field
```

### `generateChangelog()`

Generates a changelog from conventional commits.

**Returns**: `string` - The generated changelog content

**Example**:

```typescript
import { generateChangelog } from "@dataroadinc/versioning"

const changelog = generateChangelog()
console.log(changelog)
// Outputs formatted changelog
```

## CLI Commands

### `update-package-version`

Updates the package.json version based on conventional commits.

**Usage**:

```bash
npx update-package-version

```

**Options**:

- No additional options required

### `next-patch-version`

Calculates and displays the next patch version.

**Usage**:

```bash
npx next-patch-version

```

**Options**:

- No additional options required

### `generate-changelog`

Generates a changelog from conventional commits.

**Usage**:

```bash
npx generate-changelog

```

**Options**:

- No additional options required

## Utility Functions

### `parseConventionalCommits()`

Parses git log for conventional commits.

**Parameters**:

- `since`: `string` - Git reference to start from (e.g., "HEAD~10")

**Returns**: `ConventionalCommit[]` - Array of parsed commits

**Example**:

```typescript
import { parseConventionalCommits } from "@dataroadinc/versioning"

const commits = parseConventionalCommits("HEAD~5")
console.log(commits)
```

### `getVersionFromCommits()`

Determines version bump type from conventional commits.

**Parameters**:

- `commits`: `ConventionalCommit[]` - Array of conventional commits

**Returns**: `'major' | 'minor' | 'patch'` - Version bump type

**Example**:

```typescript
import { getVersionFromCommits } from "@dataroadinc/versioning"

const bumpType = getVersionFromCommits(commits)
console.log(bumpType) // "patch"
```

## Types

### `ConventionalCommit`

```typescript
interface ConventionalCommit {
  hash: string
  type: string
  scope?: string
  subject: string
  body?: string
  breaking: boolean
  date: string
}
```

### `VersionBump`

```typescript
type VersionBump = "major" | "minor" | "patch"
```

## Error Handling

All functions throw descriptive errors when:

- Package.json is not found or invalid
- Git repository is not initialized
- Conventional commit parsing fails
- Version calculation errors occur

**Example**:

```typescript
import { getCurrentVersion } from "@dataroadinc/versioning"

try {
  const version = getCurrentVersion()
} catch (error) {
  console.error("Failed to get current version:", error.message)
}
```

## Integration Examples

### Basic Usage

```typescript
import {
  getCurrentVersion,
  getNextPatchVersion,
  updatePackageVersion,
} from "@dataroadinc/versioning"

// Get current version
const current = getCurrentVersion()
console.log("Current version:", current)

// Calculate next version
const next = getNextPatchVersion()
console.log("Next version:", next)

// Update package.json
updatePackageVersion()
```

### CI/CD Integration

```typescript
import { generateChangelog } from "@dataroadinc/versioning"
import { writeFileSync } from "fs"

// Generate changelog for release
const changelog = generateChangelog()

// Write to CHANGELOG.md
writeFileSync("CHANGELOG.md", changelog, "utf8")
```

### Custom Version Logic

```typescript
import {
  parseConventionalCommits,
  getVersionFromCommits,
} from "@dataroadinc/versioning"

// Parse commits since last tag
const commits = parseConventionalCommits("v1.2.3")

// Determine bump type
const bumpType = getVersionFromCommits(commits)

// Custom version logic
if (bumpType === "major") {
  console.log("Breaking changes detected!")
}
```

## Configuration

The package uses the following configuration sources:

1. **package.json** - For current version and project metadata
2. **Git repository** - For commit history and conventional commits
3. **Environment variables** - For CI/CD integration

### Environment Variables

- `GITHUB_TOKEN` - GitHub API token for enhanced commit parsing
- `REPO_URL` - Repository URL for changelog links

## Best Practices

1. **Use conventional commits** - Follow the conventional commit specification
2. **Regular releases** - Run versioning commands regularly
3. **Automate in CI/CD** - Integrate versioning into your release pipeline
4. **Review changelogs** - Always review generated changelogs before releases
5. **Test versioning** - Test versioning logic in development environments

## Troubleshooting

### Common Issues

1. **"No conventional commits found"** - Ensure commits follow conventional
   format
2. **"Package.json not found"** - Verify working directory contains package.json
3. **"Git repository not initialized"** - Ensure git repository is properly set
   up
4. **"Version calculation failed"** - Check for invalid version formats

### Debug Mode

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=* npx update-package-version

```
