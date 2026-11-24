"use client"

import { createContext, type Provider, useContext } from "react"

/**
 * The overlay node that corner-anchored components portal into.
 *
 * A container that clips its content (`overflow-hidden`) also crops anything overhanging its
 * corners. Such a container renders a `pointer-events-none absolute inset-0` layer OUTSIDE the
 * clipped box and publishes that node here; corner-anchored descendants then position against the
 * container's true border. `null` (no provider) means render in place.
 *
 * Hold the node in state (`const [node, setNode] = useState<HTMLElement | null>(null)` with
 * `ref={setNode}`), not in a ref object: descendants have to re-render when the node arrives.
 */
const CornerSlotContext = createContext<HTMLElement | null>(null)

export const CornerSlotProvider: Provider<HTMLElement | null> = CornerSlotContext.Provider

/** The nearest corner overlay node, or `null` when no container publishes one. */
export const useCornerSlot = (): HTMLElement | null => useContext(CornerSlotContext)
