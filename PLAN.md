# Version Format Migration Plan

## Overview

This plan outlines the changes needed to migrate the `@dataroadinc/versioning`
package from using `+N` format to `-N` format for pre-release versions.

## Problem

The current `+N` format (e.g., `0.0.2+2`) is being stripped by npm during
publish, causing version conflicts when trying to publish pre-release versions.
npm treats `+N` as build metadata and removes it, resulting in duplicate version
numbers.

## Solution

Switch to the `-N` format (e.g., `0.0.2-2`) which is:

- ✅ Preserved by npm during publish
- ✅ Semantic Versioning compliant
- ✅ Supported as a valid pre-release format
- ✅ Unique per commit

## Required Changes

### 1. Update Version Generation Logic

**Files to modify:**

- `src/next-patch-version.ts`
- `src/next-minor-version.ts`
- `src/next-major-version.ts`
- `src/update-package-version.ts`

**Current format:**

```typescript
// Current: 0.0.2+2
const version = `${baseVersion}+${commitCount}`
```

**New format:**

```typescript
// New: 0.0.2-2
const version = `${baseVersion}-${commitCount}`
```

### 2. Update Version Parsing Logic

**Files to modify:**

- `src/utils/version-utils.ts` (if it exists)
- Any other files that parse version strings

**Current parsing:**

```typescript
// Current: splits on '+'
const [baseVersion, commitCount] = version.split("+")
```

**New parsing:**

```typescript
// New: splits on '-'
const [baseVersion, commitCount] = version.split("-")
```

### 3. Update Tests

**Files to modify:**

- `src/**/*.test.ts`
- `tests/**/*.test.ts`

**Test cases to update:**

- Version generation tests
- Version parsing tests
- Integration tests

**Example test updates:**

```typescript
// Before
expect(generateVersion("0.0.2", 3)).toBe("0.0.2+3")

// After
expect(generateVersion("0.0.2", 3)).toBe("0.0.2-3")
```

### 4. Update Documentation

**Files to modify:**

- `README.md`
- Any API documentation
- Code comments

**Documentation updates:**

- Update examples to show `-N` format
- Update version format descriptions
- Update changelog if needed

### 5. Update Package Version

**Files to modify:**

- `package.json`

**Version bump:**

- Increment patch version to indicate breaking change in version format
- Update changelog to document the format change

## Implementation Steps

1. **Create feature branch:**

   ```bash
   git checkout -b feat/switch-to-dash-version-format
   ```

2. **Update version generation logic:**
   - Modify all version generation functions to use `-` instead of `+`
   - Update any version parsing logic

3. **Update tests:**
   - Modify test expectations to use `-N` format
   - Add new test cases for edge cases

4. **Update documentation:**
   - Update README with new format examples
   - Update any API documentation

5. **Test the changes:**

   ```bash
   pnpm test
   pnpm build
   ```

6. **Update package version:**
   - Bump version in package.json
   - Update changelog

7. **Commit and publish:**
   ```bash
   git commit -m "feat(versioning): switch from +N to -N format for pre-releases"
   git tag v0.0.X
   npm publish
   ```

## Breaking Changes

This change is **breaking** because:

- Existing consumers expecting `+N` format will need to update
- Version parsing logic in consuming projects may need updates
- CI/CD pipelines may need updates

## Migration Strategy

1. **Major version bump** to indicate breaking change
2. **Clear documentation** of the format change
3. **Deprecation notice** for the old format (if possible)
4. **Migration guide** for consumers

## Rollback Plan

If issues arise:

1. Revert to `+N` format
2. Publish patch version with old format
3. Document the rollback and reasons

## Testing Checklist

- [ ] Version generation produces `-N` format
- [ ] Version parsing correctly handles `-N` format
- [ ] All tests pass with new format
- [ ] Integration tests work with consuming projects
- [ ] Documentation is updated
- [ ] Package builds successfully
- [ ] No breaking changes in API (only format change)

## Dependencies

After this change, the following projects will need updates:

- `dr-ts-rdf-loader` - Update to use new version format
- Any other projects using `@dataroadinc/versioning`
- CI/CD pipelines that parse version strings
