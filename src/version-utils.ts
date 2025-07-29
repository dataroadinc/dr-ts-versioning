import { execSync } from "child_process"
import { readFileSync } from "fs"
import { join } from "path"

function getPackageVersion(): string {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8")
    )
    return packageJson.version
  } catch {
    return "0.0.0"
  }
}

export function getLatestTag(): string {
  try {
    return execSync("git describe --tags --abbrev=0", {
      encoding: "utf8",
    }).trim()
  } catch {
    return "v0.0.0"
  }
}

export function getCommitCountSinceTag(tag: string): number {
  try {
    return parseInt(
      execSync(`git rev-list ${tag}..HEAD --count`, {
        encoding: "utf8",
      }).trim(),
      10
    )
  } catch {
    return 0
  }
}

export function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim()
  } catch {
    return "unknown"
  }
}

export function getCurrentVersion(): string {
  const tag = getLatestTag()
  const base = tag.replace(/^v/, "")
  const count = getCommitCountSinceTag(tag)

  // If no git tags exist, use package.json version
  if (tag === "v0.0.0" && count === 0) {
    return getPackageVersion()
  }

  // Always use base version with pre-release metadata, regardless of branch
  const version = count === 0 ? base : `${base}-${count}`
  return version
}

export function getNextPatchVersion(): string {
  const tag = getLatestTag()
  // Remove leading v
  const base = tag.replace(/^v/, "")
  const [major, minor, patch] = base.split(".").map(Number)
  const nextPatch = (patch || 0) + 1
  return `${major}.${minor}.${nextPatch}`
}
