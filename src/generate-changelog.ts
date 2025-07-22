#!/usr/bin/env node
import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Map commit types to section labels
const TYPE_LABELS: Record<string, string> = {
  feat: "Features",
  docs: "Documentation",
  content: "Content",
  partners: "Partners",
  test: "Tests",
  build: "Build System",
  deps: "Dependencies",
  style: "Style",
  perf: "Performance",
  // Add more as needed
}

const IGNORED_TYPES = ["fix", "chore", "refactor"]
const LIST_INDENT = "  "

type Commit = {
  type: string
  scope: string
  subject: string
  hash: string
  bodyLines: string[]
}

function getTags(): string[] {
  // Returns tags in reverse chronological order (most recent first)
  const tags = execSync("git tag --sort=-creatordate", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
  return tags
}

function getTagDate(tag: string): string {
  try {
    return execSync(`git log -1 --format=%ad --date=short ${tag}`, {
      encoding: "utf8",
    }).trim()
  } catch {
    return ""
  }
}

function getCommitsBetween(
  fromRef: string | null,
  toRef: string | null
): string[] {
  let range = ""
  if (fromRef && toRef) {
    range = `${fromRef}..${toRef}`
  } else if (fromRef) {
    range = `${fromRef}..HEAD`
  } else {
    range = ""
  }
  const log = execSync(`git log ${range} --format=%H%n%B%n==END==`, {
    encoding: "utf8",
  })
  return log.split("==END==\n").filter(Boolean)
}

function parseCommit(raw: string): Commit | null {
  const lines = raw.split(/\r?\n/)
  const hash = lines[0]
  let subject = ""
  let bodyLines: string[] = []
  let foundSubject = false
  let foundBody = false
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!foundSubject && line.trim() !== "") {
      subject = line.trim()
      foundSubject = true
      continue
    }
    if (foundSubject && !foundBody && line.trim() === "") {
      foundBody = true
      continue
    }
    if (foundSubject && foundBody) {
      bodyLines.push(line)
    }
  }
  // Parse type, scope, subject from the subject line
  const match = subject.match(/^(\w+)(\(([^)]+)\))?: (.+)$/)
  if (!match) return null
  const [, type, , scope, subj] = match
  return {
    type,
    scope: scope || "misc",
    subject: subj,
    hash,
    bodyLines,
  }
}

function kebabToTitle(str: string): string {
  return str
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function groupByScopeAndType(
  commits: Commit[]
): Record<string, Record<string, Commit[]>> {
  const groups: Record<string, Record<string, Commit[]>> = {}
  for (const commit of commits) {
    const scope = commit.scope
    if (!groups[scope]) groups[scope] = {}
    if (!groups[scope][commit.type]) groups[scope][commit.type] = []
    groups[scope][commit.type].push(commit)
  }
  return groups
}

function renderCommitBodyLines(bodyLines: string[], indent: string): string {
  if (!bodyLines.length) return ""
  let output = ""
  let firstNonBlank = true
  for (let i = 0; i < bodyLines.length; i++) {
    let line = bodyLines[i]
    if (line.trim() === "") {
      output += indent + "\n"
      continue
    }
    if (firstNonBlank) {
      if (!line.trim().startsWith("- ")) {
        output += indent + "- " + line.trim() + "\n"
      } else {
        output += indent + line.trim() + "\n"
      }
      firstNonBlank = false
      continue
    }
    if (line.trim().startsWith("- ")) {
      output += indent + line.trim() + "\n"
    } else {
      // Continuation of previous item
      output += indent + "  " + line.trim() + "\n"
    }
  }
  return output
}

function getGithubRepoUrl(): string | null {
  try {
    const remoteUrl = execSync("git remote get-url origin", {
      encoding: "utf8",
    }).trim()
    // SSH: git@github.com:owner/repo.git
    // HTTPS: https://github.com/owner/repo.git
    let match = remoteUrl.match(/github.com[:/](.+?)\/(.+?)(\.git)?$/)
    if (match) {
      const owner = match[1]
      const repo = match[2]
      return `https://github.com/${owner}/${repo}`
    }
    return null
  } catch {
    return null
  }
}

function main(): void {
  const tags = getTags()
  const allSections: { version: string; date: string; commits: Commit[] }[] = []

  // Section for commits after the latest tag (stateless version)
  if (tags.length > 0) {
    const latestTag = tags[0]
    const commits = getCommitsBetween(latestTag, null)
      .map(parseCommit)
      .filter((c): c is Commit => Boolean(c))
      .filter((c: Commit) => !IGNORED_TYPES.includes(c.type))
    if (commits.length > 0) {
      const commitCount = commits.length
      const version = getStatelessVersion(latestTag, commitCount)
      const date = execSync("git log -1 --format=%ad --date=short HEAD", {
        encoding: "utf8",
      }).trim()
      // Always prefix with 'v'
      allSections.push({ version: `v${version}`, date, commits })
    }
  }

  // Sections for each tag (in order)
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    const nextTag = tags[i + 1] || null
    const commits = getCommitsBetween(nextTag, tag)
      .map(parseCommit)
      .filter((c): c is Commit => Boolean(c))
      .filter((c: Commit) => !IGNORED_TYPES.includes(c.type))
    if (commits.length > 0) {
      const date = getTagDate(tag)
      // Always prefix with 'v' (even if tag already has it, ensure no double v)
      const cleanTag = tag.startsWith("v") ? tag : `v${tag}`
      allSections.push({ version: cleanTag, date, commits })
    }
  }

  // Render changelog
  let output = "# Changelog\n\n"
  const githubRepoUrl = getGithubRepoUrl()
  for (const section of allSections) {
    output += `## ${section.version}`
    if (section.date) output += ` (${section.date})`
    output += "\n\n"
    const groups = groupByScopeAndType(section.commits)
    for (const scope of Object.keys(groups).sort()) {
      output += `### ${kebabToTitle(scope)}\n\n`
      const typeGroups = groups[scope]
      for (const type of Object.keys(typeGroups)) {
        const label =
          TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1)
        output += `**${label}:**\n\n`
        for (const commit of typeGroups[type]) {
          const shortHash = commit.hash.slice(0, 7)
          let line
          if (githubRepoUrl) {
            const commitUrl = `${githubRepoUrl}/commit/${commit.hash}`
            line = `- ${commit.subject} ([${shortHash}](${commitUrl}))`
          } else {
            line = `- ${commit.subject} (${shortHash})`
          }
          output += line + "\n"
          output += renderCommitBodyLines(commit.bodyLines, LIST_INDENT)
        }
        output += "\n"
      }
    }
  }

  // Write to CHANGELOG.md
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  fs.writeFileSync(changelogPath, output, "utf8")

  // Print to stdout
  process.stdout.write(output)
}

function getStatelessVersion(latestTag: string, commitCount: number): string {
  // Remove any +N from the tag if present (shouldn't be, but for safety)
  const base = latestTag.replace(/^v/, "").split("+")[0]
  // Only ever allow one +N, and only if commitCount > 0
  return commitCount === 0 ? base : `${base}+${commitCount}`
}

main()
