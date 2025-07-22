#!/usr/bin/env ts-node
import { execSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import path from "path"
import { getCurrentVersion } from "./version-utils.js"

function getRepoRoot(): string {
  try {
    return execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    }).trim()
  } catch {
    throw new Error("Could not determine git repo root")
  }
}

function main() {
  // Accept an optional version argument
  const versionArg = process.argv[2]
  const version = versionArg || getCurrentVersion()

  // Find the root package.json using git repo root
  const repoRoot = getRepoRoot()
  const pkgPath = path.join(repoRoot, "package.json")
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
  pkg.version = version
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8")
  console.log(`Updated package.json version to ${version}`)
}

main()
