# Conventional Commits

This guide covers the conventional commit standards used by the
`@dataroadinc/versioning` package for automatic versioning and changelog
generation.

## Overview

Conventional commits provide a standardized way to write commit messages that
can be automatically parsed for versioning and changelog generation. This
project follows the
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/)
specification.

## Commit Message Format

```

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

```

### Structure

- **Type**: Required. Describes the kind of change (feat, fix, docs, etc.)
- **Scope**: Optional. Describes the part of the codebase affected
- **Description**: Required. Short description of the change
- **Body**: Optional. Longer description of the change
- **Footer**: Optional. References to issues, breaking changes, etc.

## Commit Types

### `feat`

A new feature for the user.

```bash
git commit -m "feat(api): add user authentication endpoint"
git commit -m "feat: add dark mode support"

```

**Version Impact**: Minor version bump (1.2.3 → 1.3.0)

### `fix`

A bug fix for the user.

```bash
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "fix: correct version parsing logic"

```

**Version Impact**: Patch version bump (1.2.3 → 1.2.4)

### `docs`

Documentation only changes.

```bash
git commit -m "docs(readme): update installation instructions"
git commit -m "docs: add API reference documentation"

```

**Version Impact**: No version bump

### `style`

Changes that do not affect the meaning of the code (white-space, formatting,
missing semi-colons, etc.).

```bash
git commit -m "style: format code with prettier"
git commit -m "style(eslint): fix indentation issues"

```

**Version Impact**: No version bump

### `refactor`

A code change that neither fixes a bug nor adds a feature.

```bash
git commit -m "refactor(utils): extract common validation logic"
git commit -m "refactor: simplify version calculation"

```

**Version Impact**: No version bump

### `perf`

A code change that improves performance.

```bash
git commit -m "perf(parser): optimize commit parsing"
git commit -m "perf: improve changelog generation speed"

```

**Version Impact**: No version bump

### `test`

Adding missing tests or correcting existing tests.

```bash
git commit -m "test(api): add authentication tests"
git commit -m "test: add unit tests for version utils"

```

**Version Impact**: No version bump

### `chore`

Other changes that don't modify src or test files.

```bash
git commit -m "chore(deps): update dependencies"
git commit -m "chore: update CI configuration"

```

**Version Impact**: No version bump

### `ci`

Changes to CI configuration files and scripts.

```bash
git commit -m "ci(github): add release workflow"
git commit -m "ci: update build configuration"

```

**Version Impact**: No version bump

### `build`

Changes that affect the build system or external dependencies.

```bash
git commit -m "build(webpack): update build configuration"
git commit -m "build: add TypeScript compilation"

```

**Version Impact**: No version bump

## Scopes

Scopes help categorize changes within a specific area of the codebase. Use
kebab-case for scope names.

### Common Scopes for This Project

- `versioning` - Version calculation and management
- `changelog` - Changelog generation
- `cli` - Command-line interface
- `api` - API functions and types
- `docs` - Documentation
- `deps` - Dependencies
- `build` - Build system
- `test` - Testing
- `ci` - Continuous integration

### Examples

```bash
git commit -m "feat(versioning): add next patch version calculation"
git commit -m "fix(changelog): resolve formatting issues"
git commit -m "docs(api): update function documentation"
git commit -m "test(cli): add command line tests"

```

## Breaking Changes

Breaking changes are indicated by:

1. Including `!` after the type/scope
2. Including `BREAKING CHANGE:` in the footer

### Using `!` (Recommended)

```bash
git commit -m "feat(api)!: change function signature"
git commit -m "fix(versioning)!: update version format"

```

### Using Footer

```bash
git commit -m "feat(api): add new authentication method

BREAKING CHANGE: The old auth method is no longer supported"

```

**Version Impact**: Major version bump (1.2.3 → 2.0.0)

## Multi-line Commit Messages

For complex changes, use multi-line commit messages:

```bash
git commit -m "feat(versioning): add support for custom version formats" \
           -m "This change allows users to specify custom version formats" \
           -m "for their projects, making the versioning system more" \
           -m "flexible and adaptable to different workflows."

```

## Examples

### Feature Addition

```bash
git commit -m "feat(api): add getCurrentVersion function

- Add function to retrieve current version from package.json
- Include proper error handling for missing package.json
- Add TypeScript types for return values"

```

### Bug Fix

```bash
git commit -m "fix(changelog): resolve empty changelog generation

The changelog was empty when no conventional commits were found.
This fix ensures a proper message is displayed instead."

```

### Documentation Update

```bash
git commit -m "docs(readme): update installation instructions

- Add Node.js version requirements
- Include pnpm installation steps
- Add troubleshooting section"

```

### Breaking Change

```bash
git commit -m "feat(api)!: change version calculation logic

The version calculation now uses a different algorithm that
provides more accurate results for complex commit histories.

BREAKING CHANGE: The getNextVersion function now returns a
different format and may produce different results than before."

```

## Version Bump Rules

The versioning system uses these rules to determine version bumps:

### Major Version (X.0.0)

- Breaking changes (`!` or `BREAKING CHANGE:`)
- Any commit with `!` after type/scope

### Minor Version (0.X.0)

- New features (`feat` type)
- Any commit that adds functionality

### Patch Version (0.0.X)

- Bug fixes (`fix` type)
- Performance improvements (`perf` type)
- Documentation updates (`docs` type)
- Code refactoring (`refactor` type)
- Test additions (`test` type)
- Build system changes (`build` type)
- CI/CD changes (`ci` type)
- Dependencies (`chore` type)

## Best Practices

### 1. Be Descriptive

```bash
# Good
git commit -m "feat(auth): add OAuth2 authentication support"

# Bad
git commit -m "feat: add auth"

```

### 2. Use Imperative Mood

```bash
# Good
git commit -m "feat: add user authentication"

# Bad
git commit -m "feat: added user authentication"

```

### 3. Keep It Short

```bash
# Good
git commit -m "fix(parser): resolve version parsing edge case"

# Bad
git commit -m "fix(parser): resolve version parsing edge case that occurs when the version string contains special characters and the parser fails to handle them properly"

```

### 4. Use Scopes Appropriately

```bash
# Good
git commit -m "feat(versioning): add custom version format support"

# Bad
git commit -m "feat: add custom version format support"

```

### 5. Reference Issues

```bash
git commit -m "fix(auth): resolve token expiration issue

Closes #123"

```

## Integration with Versioning

The conventional commit format enables automatic:

1. **Version Bumping**: Based on commit types and breaking changes
2. **Changelog Generation**: Grouped by type and scope
3. **Release Notes**: Formatted for GitHub/GitLab releases
4. **Semantic Versioning**: Following semver.org specification

## Tools and Validation

### Commitlint

This project uses commitlint to validate commit messages:

```bash
# Install commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# Validate commit message
npx commitlint --edit .git/COMMIT_EDITMSG

```

### Pre-commit Hooks

Husky runs commitlint on every commit to ensure compliance:

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Troubleshooting

### Invalid Commit Message

If you get a commitlint error:

1. **Check the format**: Ensure it follows the conventional commit format
2. **Use the correct type**: Choose from the allowed types
3. **Check scope**: Ensure scope is kebab-case and allowed
4. **Fix and recommit**: Amend the commit with the correct message

### Version Not Bumping

If the version isn't bumping as expected:

1. **Check commit types**: Ensure you're using the correct type
2. **Verify breaking changes**: Use `!` or `BREAKING CHANGE:` for major bumps
3. **Check commit history**: Ensure commits are conventional
4. **Run versioning commands**: Use the CLI commands to check

### Changelog Issues

If the changelog isn't generating correctly:

1. **Check commit format**: Ensure all commits follow the conventional format
2. **Verify commit history**: Check that commits are being parsed correctly
3. **Run debug mode**: Use `DEBUG=*` to see parsing details
4. **Check scope usage**: Ensure scopes are consistent and meaningful
