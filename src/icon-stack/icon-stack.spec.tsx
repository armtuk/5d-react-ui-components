import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CornerSlotProvider } from "../corner-slot/corner-slot.tsx"
import { IconStack } from "./icon-stack.tsx"
import { IconStackItem } from "./icon-stack-item.tsx"

const withCornerSlot = (test: (slot: HTMLElement) => void): void => {
  const slot = document.createElement("div")
  document.body.appendChild(slot)
  try {
    test(slot)
  } finally {
    slot.remove()
  }
}

describe("IconStack", () => {
  it("renders nothing for an empty member list", () => {
    const { container } = render(<IconStack placement={{ edge: "top-right" }}>{null}</IconStack>)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when every member is conditionally absent", () => {
    const { container } = render(
      <IconStack placement="inline">
        {false}
        {undefined}
      </IconStack>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("anchors top-right reversed, so the first member is rightmost while DOM order is tier order", () => {
    const { container } = render(
      <IconStack placement={{ edge: "top-right" }}>
        <IconStackItem label="tier-1">1</IconStackItem>
        <IconStackItem label="tier-2">2</IconStackItem>
      </IconStack>,
    )
    const stack = container.firstElementChild as HTMLElement
    expect(stack).toHaveClass("-top-3", "-right-3", "absolute", "flex-row-reverse", "gap-1")
    const [first, second] = Array.from(stack.children)
    expect(first).toHaveAccessibleName("tier-1")
    expect(second).toHaveAccessibleName("tier-2")
  })

  it("anchors top-left in order", () => {
    const { container } = render(
      <IconStack placement={{ edge: "top-left" }}>
        <IconStackItem label="tier-1">1</IconStackItem>
      </IconStack>,
    )
    expect(container.firstElementChild).toHaveClass("-top-3", "-left-3", "absolute", "flex-row", "items-start")
    expect(container.firstElementChild).not.toHaveClass("flex-row-reverse")
  })

  it("anchors bottom-left aligned to the bottom edge", () => {
    const { container } = render(
      <IconStack placement={{ edge: "bottom-left" }}>
        <IconStackItem label="tier-1">1</IconStackItem>
      </IconStack>,
    )
    expect(container.firstElementChild).toHaveClass("-bottom-3", "-left-3", "absolute", "flex-row", "items-end")
  })

  it("leaves an inline stack for its owner to position", () => {
    const { container } = render(
      <IconStack placement="inline" className="absolute top-0 right-0">
        <IconStackItem label="x">1</IconStackItem>
      </IconStack>,
    )
    const stack = container.firstElementChild
    expect(stack).toHaveClass("flex", "gap-1", "absolute", "top-0", "right-0")
    expect(stack).not.toHaveClass("-top-3")
    expect(stack).not.toHaveClass("-left-3")
  })

  it("lets className replace the default corner offsets", () => {
    const { container } = render(
      <IconStack placement={{ edge: "top-right" }} className="-top-4 -right-4">
        <IconStackItem label="x">1</IconStackItem>
      </IconStack>,
    )
    expect(container.firstElementChild).toHaveClass("-top-4", "-right-4", "absolute")
    expect(container.firstElementChild).not.toHaveClass("-top-3")
    expect(container.firstElementChild).not.toHaveClass("-right-3")
  })

  it("passes div attributes and ref through to the row", () => {
    const refs: (HTMLDivElement | null)[] = []
    render(
      <IconStack
        placement="inline"
        data-slot="owner-strip"
        id="strip"
        ref={(node: HTMLDivElement | null) => {
          refs.push(node)
        }}
      >
        <IconStackItem label="x">1</IconStackItem>
      </IconStack>,
    )
    const row = document.getElementById("strip")
    expect(row).toHaveAttribute("data-slot", "owner-strip")
    expect(refs[0]).toBe(row)
  })

  it("portals an edge-anchored stack into the corner slot with pointer events restored", () => {
    withCornerSlot((slot) => {
      render(
        <CornerSlotProvider value={slot}>
          <div data-testid="in-flow">
            <IconStack placement={{ edge: "top-right" }}>
              <IconStackItem label="portaled">1</IconStackItem>
            </IconStack>
          </div>
        </CornerSlotProvider>,
      )
      expect(screen.getByTestId("in-flow")).toBeEmptyDOMElement()
      const item = within(slot).getByRole("img", { name: "portaled" })
      expect(item.parentElement).toHaveClass("pointer-events-auto", "-top-3", "-right-3")
    })
  })

  it("keeps an inline stack in place when a corner slot is present", () => {
    withCornerSlot((slot) => {
      const { container } = render(
        <CornerSlotProvider value={slot}>
          <IconStack placement="inline">
            <IconStackItem label="x">1</IconStackItem>
          </IconStack>
        </CornerSlotProvider>,
      )
      expect(within(container).getByRole("img", { name: "x" })).toBeInTheDocument()
      expect(slot).toBeEmptyDOMElement()
    })
  })
})
