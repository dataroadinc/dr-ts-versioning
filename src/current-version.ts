#!/usr/bin/env node

/**
 * Outputs the current stateless version in the format:
 *   version=1.0.0+12
 * This is required for GitHub Actions compatibility, so that the output can be
 * directly appended to $GITHUB_OUTPUT and used as a workflow output variable.
 *
 * Usage in workflow:
 *   - name: Get next patch version
 *     id: version
 *     run: pnpm current-version >> $GITHUB_OUTPUT
 *   # Then use as ${{ steps.version.outputs.version }}
 */
import { getCurrentVersion } from "./version-utils.js"

function main(): void {
  console.log(`version=${getCurrentVersion()}`)
}

main()
