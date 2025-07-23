# CLI Usage

This guide covers the command-line interface for the `@dataroadinc/versioning`
package.

## Installation

The CLI commands are available after installing the package:

```bash
# Using pnpm (recommended)
pnpm add @dataroadinc/versioning

# Using npm
npm install @dataroadinc/versioning

# Using yarn
yarn add @dataroadinc/versioning
```

## Available Commands

### `update-package-version`

Updates the package.json version based on conventional commits since the last
version.

**Usage**:

```bash
# Using pnpm (recommended)
pnpm exec update-package-version

# Using npx
npx update-package-version
```

**What it does**:

1. Reads the current version from package.json
2. Analyzes conventional commits since the last version
3. Determines the appropriate version bump (major/minor/patch)
4. Updates package.json with the new version
5. Outputs the new version to stdout

**Example output**:

```bash
$ npx update-package-version
Updated version from 1.2.3 to 1.2.4
1.2.4

```

### `next-patch-version`

Calculates and displays the next patch version without updating package.json.

**Usage**:

```bash
# Using pnpm (recommended)
pnpm exec next-patch-version

# Using npx
npx next-patch-version
```

**What it does**:

1. Reads the current version from package.json
2. Analyzes conventional commits since the last version
3. Calculates the next version based on commit types
4. Outputs the calculated version to stdout

**Example output**:

```bash
$ npx next-patch-version
1.2.4

```

### `generate-changelog`

Generates a changelog from conventional commits.

**Usage**:

```bash
# Using pnpm (recommended)
pnpm exec generate-changelog

# Using npx
npx generate-changelog
```

**What it does**:

1. Analyzes conventional commits since the last version
2. Groups commits by type (feat, fix, docs, etc.)
3. Formats commits into a readable changelog
4. Writes the changelog to `CHANGELOG.md` in the project root
5. Outputs the changelog to stdout

**Example output**:

```bash
$ npx generate-changelog
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

## Script Integration

You can integrate these commands into your package.json scripts:

```json
{
  "scripts": {
    "version:current": "npx update-package-version",
    "version:next": "npx next-patch-version",
    "version:release": "npx update-package-version && npx generate-changelog"
  }
}
```

Then use them with pnpm:

```bash
# Update to next version
pnpm version:current

# See what the next version would be
pnpm version:next

# Generate changelog and update version
pnpm version:release

**Note**: The `version:release` script updates the version first, then generates the changelog. This ensures the changelog reflects the correct version information.

```

## CI/CD Integration

### GitHub Actions

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
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

      - name: Update version
        run: pnpm exec update-package-version

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
release:
  stage: release
  image: node:22
  script:
    - npm install -g pnpm

    - pnpm install

    - pnpm exec generate-changelog

    - pnpm exec update-package-version

    - git config user.email "ci@example.com"

    - git config user.name "CI"

    - git add package.json CHANGELOG.md

    - git commit -m "chore(release): update version and changelog"

    - git push

  only:
    - tags
```

## Environment Variables

### `GITHUB_TOKEN`

Optional GitHub API token for enhanced commit parsing and changelog generation.

```bash
export GITHUB_TOKEN=your_github_token
npx generate-changelog

```

### `REPO_URL`

Optional repository URL for generating links in changelog.

```bash
export REPO_URL=https://github.com/username/repo
npx generate-changelog

```

## Error Handling

The CLI commands provide clear error messages for common issues:

### No Conventional Commits Found

```bash
$ npx update-package-version
Error: No conventional commits found since last version

```

**Solution**: Ensure commits follow the conventional commit format.

### Package.json Not Found

```bash
$ npx update-package-version
Error: package.json not found in current directory

```

**Solution**: Run the command from the project root directory.

### Invalid Version Format

```bash
$ npx update-package-version
Error: Invalid version format in package.json

```

**Solution**: Check that package.json has a valid semver version.

## Debug Mode

Enable debug logging to see detailed information about the versioning process:

```bash
DEBUG=* npx update-package-version

```

This will show:

- Commit parsing details
- Version calculation logic
- File operations
- Error stack traces

## Examples

### Basic Workflow

```bash
# 1. Make some changes and commit them
git add .
git commit -m "feat(api): add new endpoint"

# 2. See what the next version would be
npx next-patch-version
# Output: 1.2.4

# 3. Generate changelog
npx generate-changelog > CHANGELOG.md

# 4. Update version
npx update-package-version
# Output: Updated version from 1.2.3 to 1.2.4

# 5. Commit the changes
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version to 1.2.4"

# 6. Tag the release
git tag v1.2.4
git push origin v1.2.4

```

### Automated Release

```bash
# Create a release script
cat > release.sh << 'EOF'
#!/bin/bash
set -e

echo "Generating changelog..."
npx generate-changelog > CHANGELOG.md

echo "Updating version..."
npx update-package-version

echo "Committing changes..."
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version"

echo "Creating tag..."
VERSION=$(npx next-patch-version)
git tag v$VERSION

echo "Pushing changes..."
git push
git push --tags

echo "Release v$VERSION completed!"
EOF

chmod +x release.sh
./release.sh

```

## Troubleshooting

### Command Not Found

If you get "command not found" errors:

1. **Check installation**: Ensure the package is installed

   ```bash
   pnpm list @dataroadinc/versioning
   ```

2. **Use npx**: Always use `npx` to run the commands

   ```bash
   npx update-package-version
   ```

3. **Check PATH**: Ensure node_modules/.bin is in your PATH

### Permission Errors

If you get permission errors:

1. **Check file permissions**: Ensure package.json is writable

   ```bash
   chmod 644 package.json
   ```

2. **Use sudo if needed**: For system-wide installations

   ```bash
   sudo npx update-package-version
   ```

### Git Issues

If git-related errors occur:

1. **Check git status**: Ensure you're in a git repository

   ```bash
   git status
   ```

2. **Check git config**: Ensure git is properly configured

   ```bash
   git config --list
   ```

3. **Check commit history**: Ensure there are conventional commits

   ```bash
   git log --oneline
   ```
