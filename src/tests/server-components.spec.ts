import { describe, expect, it } from "vitest"

const sources = import.meta.glob<string>(["../**/*.{ts,tsx}", "!../**/*.spec.{ts,tsx}"], { query: "?raw", import: "default", eager: true })

const usesClientFeatures = (source: string): boolean => /\b(createContext|use[A-Z]\w*)(<[^()]*>)?\(/.test(source)

const clientModules = Object.entries(sources).filter(([, source]) => usesClientFeatures(source))

describe("server component support", () => {
  it.each(clientModules)("%s uses hooks or context, so it declares the client boundary", (_path: string, source: string) => {
    expect(source).toMatch(/^"use client"\n/)
  })

  it("keeps IconStackItem server-renderable, so a server component can pass it renderLink", () => {
    const item = sources["../icon-stack/icon-stack-item.tsx"]
    expect(item).toBeDefined()
    expect(item).not.toContain("use client")
  })

  it("finds the client modules it guards", () => {
    expect(clientModules.map(([path]) => path).sort()).toEqual(["../corner-slot/corner-slot.tsx", "../icon-stack/icon-stack.tsx"])
  })
})
