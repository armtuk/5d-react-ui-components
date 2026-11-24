"use client"

import { Children, type ComponentProps, type ReactElement } from "react"
import { createPortal } from "react-dom"
import { useCornerSlot } from "../corner-slot/corner-slot.tsx"
import { cn } from "../lib/cn.ts"

/** The container corners a stack can anchor to. */
export type IconStackAnchor = "top-left" | "top-right" | "bottom-left"

/**
 * Where an `IconStack` sits. `"inline"`: a bare row the owner positions via `className`.
 * `{ edge }`: overhangs a corner of the nearest positioned ancestor by 12px, half an `sm` badge.
 */
export type IconStackPlacement = "inline" | { edge: IconStackAnchor }

export interface IconStackProps extends ComponentProps<"div"> {
  /** Inline (owner-positioned) or anchored to a container corner. */
  placement: IconStackPlacement
}

/**
 * A row of small metadata icons, usually overhanging the corner of a card or tile.
 *
 * Members are composed as children, HIGHEST information tier first; the first member always takes
 * the corner position. Renders `null` without members, so an empty stack reserves no space. Inside
 * a `CornerSlotProvider`, an edge-anchored stack portals into the published overlay node.
 */
export const IconStack = ({ placement, className, children, ...props }: IconStackProps): ReactElement | null => {
  const cornerSlot = useCornerSlot()
  const members = Children.toArray(children)
  if (members.length === 0) return null

  const edge = placement === "inline" ? undefined : placement.edge
  const portalTarget = edge === undefined ? null : cornerSlot
  const stack = (
    <div
      {...props}
      className={cn(
        edge === undefined ? INLINE_ROW : EDGE_ROW[edge],
        // The overlay layer is `pointer-events-none`; links and buttons need pointer events back.
        portalTarget !== null && "pointer-events-auto",
        className,
      )}
    >
      {members}
    </div>
  )
  return portalTarget === null ? stack : createPortal(stack, portalTarget)
}

const INLINE_ROW = "flex flex-row items-start gap-1"

/**
 * Complete literals, so Tailwind's scanner can find them. The right anchor reverses the row, which
 * puts the first member in the corner.
 */
const EDGE_ROW: Record<IconStackAnchor, string> = {
  "top-left": "-top-3 -left-3 absolute flex flex-row items-start gap-1",
  "top-right": "-top-3 -right-3 absolute flex flex-row-reverse items-start gap-1",
  "bottom-left": "-bottom-3 -left-3 absolute flex flex-row items-end gap-1",
}
