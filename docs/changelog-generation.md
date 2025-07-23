# Changelog Generation

This guide covers the changelog generation features of the
`@dataroadinc/versioning` package.

## Overview

The changelog generation system automatically creates human-readable changelogs
from conventional commits. It groups commits by type, formats them consistently,
and provides a clear history of changes for each release.

## How It Works

### 1. Commit Analysis

The system analyzes git commits since the last version tag:

```bash
# Get commits since last version
git log --oneline v1.2.3..HEAD

```

### 2. Conventional Commit Parsing

Each commit is parsed according to the conventional commit specification:

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

### 3. Grouping and Categorization

Commits are grouped by type and scope:

- **Features** (`feat`) - New functionality
- **Bug Fixes** (`fix`) - Bug fixes and patches
- **Documentation** (`docs`) - Documentation changes
- **Performance** (`perf`) - Performance improvements
- **Refactoring** (`refactor`) - Code refactoring
- **Tests** (`test`) - Test additions and changes
- **Build** (`build`) - Build system changes
- **CI/CD** (`ci`) - CI/CD configuration changes
- **Chores** (`chore`) - Maintenance tasks

### 4. Formatting

The system formats commits into a structured changelog:

```markdown
# Changelog

## [1.2.4] - 2024-01-15

### Features

- Add support for custom commit scopes
- Implement version bump detection

### Bug Fixes

- Fix version parsing for pre-release versions
- Resolve changelog generation edge cases

### Documentation

- Update API documentation
- Add usage examples
```

## Usage

### Basic Generation

Generate a changelog for the current version:

```bash
# Using pnpm (recommended)
pnpm exec generate-changelog

# Using npx
npx generate-changelog
```

### Output to File

The changelog is automatically written to `CHANGELOG.md` in the project root:

```bash
# Using pnpm (recommended)
pnpm exec generate-changelog

# Using npx
npx generate-changelog
```

**Note**: The command automatically creates/updates `CHANGELOG.md` in the
project root. No output redirection is needed.

### Custom Range

Generate changelog for a specific version range:

```bash
# Since a specific tag
pnpm exec generate-changelog --since v1.0.0

# Since a specific commit
pnpm exec generate-changelog --since abc1234

# Between two versions
pnpm exec generate-changelog --since v1.2.0 --until v1.3.0

# Using npx (alternative)
npx generate-changelog --since v1.0.0
npx generate-changelog --since abc1234
npx generate-changelog --since v1.2.0 --until v1.3.0
```

## Changelog Format

### Header

```markdown
# Changelog

All notable changes to this project will be documented in this file.
```

### Version Sections

Each version has its own section:

```markdown
## [1.2.4] - 2024-01-15

### Features

- Add support for custom commit scopes
- Implement version bump detection

### Bug Fixes

- Fix version parsing for pre-release versions
- Resolve changelog generation edge cases

### Documentation

- Update API documentation
- Add usage examples
```

### Breaking Changes

Breaking changes are highlighted:

```markdown
## [2.0.0] - 2024-01-15

### ⚠️ Breaking Changes

- Change function signature for `getNextVersion`
- Remove deprecated `parseVersion` function

### Features

- Add new version calculation algorithm
- Implement custom version formats
```

## Commit Grouping

### By Type

Commits are grouped by their conventional commit type:

- **Features** - New functionality added
- **Bug Fixes** - Issues resolved
- **Documentation** - Documentation updates
- **Performance** - Performance improvements
- **Refactoring** - Code refactoring
- **Tests** - Test additions and changes
- **Build** - Build system changes
- **CI/CD** - CI/CD configuration
- **Chores** - Maintenance tasks

### By Scope

Within each type, commits can be grouped by scope:

```markdown
### Features

- **api**: Add new authentication endpoint
- **cli**: Add interactive version selection
- **versioning**: Add custom version format support
```

### Breaking Changes

Breaking changes are always highlighted at the top:

```markdown
### ⚠️ Breaking Changes

- Change function signature for `getNextVersion`
- Remove deprecated `parseVersion` function
```

## Customization

### Environment Variables

#### `GITHUB_TOKEN`

Optional GitHub API token for enhanced commit parsing:

```bash
export GITHUB_TOKEN=your_github_token
npx generate-changelog

```

#### `REPO_URL`

Repository URL for generating commit links:

```bash
export REPO_URL=https://github.com/username/repo
npx generate-changelog

```

### Configuration File

Create a `.changelogrc.json` file for custom configuration:

```json
{
  "types": {
    "feat": "Features",
    "fix": "Bug Fixes",
    "docs": "Documentation",
    "style": "Styles",
    "refactor": "Code Refactoring",
    "perf": "Performance Improvements",
    "test": "Tests",
    "build": "Build System",
    "ci": "Continuous Integration",
    "chore": "Chores"
  },
  "scopes": {
    "api": "API",
    "cli": "CLI",
    "versioning": "Versioning",
    "changelog": "Changelog",
    "docs": "Documentation"
  },
  "template": {
    "header": "# Changelog\n\n",
    "version": "## [{version}] - {date}\n\n",
    "breaking": "### ⚠️ Breaking Changes\n",
    "type": "### {type}\n",
    "commit": "- {message}\n"
  }
}
```

## Integration Examples

### GitHub Actions

```yaml
name: Generate Changelog

on:
  push:
    tags:
      - "v*"

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      - run: npm install -g pnpm

      - run: pnpm install

      - name: Generate changelog
        run: pnpm exec generate-changelog

      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body_path: CHANGELOG.md
          draft: false
          prerelease: false
```

### GitLab CI

```yaml
generate_changelog:
  stage: release
  image: node:22
  script:
    - npm install -g pnpm

    - pnpm install

    - pnpm exec generate-changelog

    - |

      cat > release_notes.md << EOF
      # Release Notes

      $(cat CHANGELOG.md)
      EOF
  artifacts:
    paths:
      - CHANGELOG.md
      - release_notes.md
    expire_in: 1 week
  only:
    - tags
```

### Local Development

```bash
#!/bin/bash
# release.sh

set -e

echo "Generating changelog..."
pnpm exec generate-changelog

echo "Updating version..."
pnpm exec update-package-version

echo "Committing changes..."
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version and update changelog"

echo "Creating tag..."
VERSION=$(pnpm exec next-patch-version)
git tag v$VERSION

echo "Pushing changes..."
git push
git push --tags

echo "Release v$VERSION completed!"

```

## Advanced Features

### Custom Commit Types

Add custom commit types to the configuration:

```json
{
  "types": {
    "feat": "Features",
    "fix": "Bug Fixes",
    "docs": "Documentation",
    "security": "Security Updates",
    "deprecate": "Deprecations"
  }
}
```

### Custom Templates

Create custom changelog templates:

```json
{
  "template": {
    "header": "# Release History\n\n",
    "version": "## Version {version} ({date})\n\n",
    "breaking": "### 🚨 Breaking Changes\n",
    "type": "### {type}\n",
    "commit": "- {message} ({hash})\n"
  }
}
```

### Filtering Commits

Filter commits by scope or type:

```bash
# Only show features and bug fixes
pnpm exec generate-changelog --types feat,fix

# Only show commits for specific scopes
pnpm exec generate-changelog --scopes api,cli

# Using npx (alternative)
npx generate-changelog --types feat,fix
npx generate-changelog --scopes api,cli
```

## Troubleshooting

### Empty Changelog

If the changelog is empty:

1. **Check commit history**: Ensure there are conventional commits

   ```bash
   git log --oneline
   ```

2. **Verify conventional format**: Check that commits follow the format

   ```bash
   git log --pretty=format:"%s"
   ```

3. **Check version tags**: Ensure there are proper version tags

   ```bash
   git tag -l
   ```

### Missing Commits

If some commits are missing:

1. **Check commit range**: Verify the commit range being analyzed
2. **Check conventional format**: Ensure all commits follow the format
3. **Check git depth**: Ensure full git history is available

   ```bash
   git fetch --unshallow
   ```

### Formatting Issues

If the changelog formatting is incorrect:

1. **Check configuration**: Verify the changelog configuration
2. **Check commit messages**: Ensure proper conventional commit format
3. **Run with debug**: Use debug mode to see parsing details

   ```bash
   DEBUG=* pnpm exec generate-changelog
   ```

## Best Practices

### 1. Consistent Commit Messages

Use consistent conventional commit messages:

```bash
git commit -m "feat(api): add user authentication"
git commit -m "fix(changelog): resolve formatting issues"
git commit -m "docs(readme): update installation guide"

```

### 2. Regular Releases

Generate changelogs regularly:

```bash
# Before each release
pnpm exec generate-changelog
git add CHANGELOG.md
git commit -m "chore(release): update changelog"

```

### 3. Review Changelogs

Always review generated changelogs:

```bash
# Generate and review
pnpm exec generate-changelog
cat CHANGELOG.md

```

### 4. Automate in CI/CD

Integrate changelog generation into your CI/CD pipeline:

```yaml
- name: Generate changelog
  run: npx generate-changelog > CHANGELOG.md
```

### 5. Use Meaningful Scopes

Use scopes to categorize changes:

```bash
git commit -m "feat(versioning): add custom version formats"
git commit -m "fix(changelog): resolve empty changelog issue"
git commit -m "docs(api): update function documentation"

```
