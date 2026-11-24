import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { IconStackItem } from "./icon-stack-item.tsx"

describe("IconStackItem", () => {
  it("carries its label as accessible name and tooltip", () => {
    render(<IconStackItem label="Server">i</IconStackItem>)
    expect(screen.getByRole("img", { name: "Server" })).toHaveAttribute("title", "Server")
  })

  it("shows a fuller title without changing the accessible name", () => {
    render(
      <IconStackItem label="Locked" title="Locked by an administrator">
        i
      </IconStackItem>,
    )
    expect(screen.getByRole("img", { name: "Locked" })).toHaveAttribute("title", "Locked by an administrator")
  })

  it("clips the colored square but not the overlays", () => {
    render(
      <IconStackItem label="Server" color="#336699" overlays={<span data-testid="overlay">!</span>}>
        i
      </IconStackItem>,
    )
    const item = screen.getByRole("img", { name: "Server" })
    expect(item.firstElementChild).toHaveClass("overflow-hidden", "rounded-md", "border")
    expect(item.firstElementChild).toHaveStyle({ backgroundColor: "#336699" })
    expect(screen.getByTestId("overlay").parentElement).toBe(item)
  })

  it("renders a self-contained mark as the only accessible image", () => {
    render(
      <IconStackItem label="Database" selfContained>
        <svg role="img" aria-label="Database" />
      </IconStackItem>,
    )
    const mark = screen.getByRole("img", { name: "Database" })
    expect(mark.parentElement).toHaveAttribute("title", "Database")
    expect(mark.parentElement).not.toHaveAttribute("role")
  })

  it("leaves the tooltip to the link around a self-contained mark", () => {
    render(
      <IconStackItem label="Database" href="https://example.com/x" selfContained>
        <svg aria-hidden="true" data-testid="mark" />
      </IconStackItem>,
    )
    expect(screen.getByRole("link", { name: "Database" })).toHaveAttribute("title", "Database")
    expect(screen.getByTestId("mark").parentElement).not.toHaveAttribute("title")
  })

  it("renders an href member as a new-tab anchor that owns the accessible name", () => {
    render(
      <IconStackItem label="Open docs" href="https://example.com/x">
        i
      </IconStackItem>,
    )
    const link = screen.getByRole("link", { name: "Open docs" })
    expect(link).toHaveAttribute("href", "https://example.com/x")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer noopener")
    expect(link).toHaveAttribute("title", "Open docs")
    expect(link).toHaveClass("inline-flex")
    expect(screen.queryByRole("img")).toBeNull()
  })

  it("renders the caller's link element through renderLink", () => {
    render(
      <IconStackItem
        label="Settings"
        title="Open settings"
        renderLink={({ children, ...link }) => (
          <a href="/settings" data-router-link="" {...link}>
            {children}
          </a>
        )}
      >
        i
      </IconStackItem>,
    )
    const link = screen.getByRole("link", { name: "Settings" })
    expect(link).toHaveAttribute("href", "/settings")
    expect(link).toHaveAttribute("data-router-link")
    expect(link).toHaveAttribute("title", "Open settings")
    expect(link).not.toHaveAttribute("target")
    expect(screen.queryByRole("img")).toBeNull()
  })

  it("rejects two kinds of link at compile time", () => {
    render(
      // @ts-expect-error href and renderLink are mutually exclusive
      <IconStackItem label="x" href="/a" renderLink={() => <a href="/b">b</a>}>
        i
      </IconStackItem>,
    )
    expect(screen.getAllByRole("link")).toHaveLength(1)
  })

  it("sizes the badge square, defaulting to md", () => {
    render(
      <>
        <IconStackItem label="small" size="sm">
          i
        </IconStackItem>
        <IconStackItem label="default">i</IconStackItem>
      </>,
    )
    expect(screen.getByRole("img", { name: "small" })).toHaveClass("h-6", "w-6")
    expect(screen.getByRole("img", { name: "small" }).firstElementChild).toHaveClass("rounded")
    expect(screen.getByRole("img", { name: "default" })).toHaveClass("h-8", "w-8")
  })
})
