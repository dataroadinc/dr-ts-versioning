#!/usr/bin/env node

/**
 * Outputs the next patch version in the format:
 *   version=v1.0.1
 * This is required for GitHub Actions compatibility, so that the output can be
 * directly appended to $GITHUB_OUTPUT and used as a workflow output variable.
 *
 * Usage in workflow:
 *   - name: Get next patch version
 *     id: version
 *     run: pnpm --reporter=silent next-patch-version >> $GITHUB_OUTPUT
 *   # Then use as ${{ steps.version.outputs.version }}
 */
import { getNextPatchVersion } from "./version-utils"

function main(): void {
  console.log(`version=${getNextPatchVersion()}`)
}

main()
