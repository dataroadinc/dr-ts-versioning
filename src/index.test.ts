import { describe, expect, it } from "vitest"
import { getCurrentVersion, getNextPatchVersion } from "./index"

describe("dr-ts-versioning", () => {
  it("should export getCurrentVersion function", () => {
    expect(typeof getCurrentVersion).toBe("function")
  })

  it("should export getNextPatchVersion function", () => {
    expect(typeof getNextPatchVersion).toBe("function")
  })

  it("should get current version from package.json", () => {
    const version = getCurrentVersion()
    expect(version).toBeDefined()
    expect(typeof version).toBe("string")
    // Should match semver format
    expect(version).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
