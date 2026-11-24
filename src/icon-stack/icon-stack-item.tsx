import type { ReactElement, ReactNode } from "react"
import { cn } from "../lib/cn.ts"

/** Badge sizes: `sm` is a 24px square, `md` a 32px square. */
export type IconStackItemSize = "sm" | "md"

/** The props a custom link element must spread: its accessible name, tooltip, classes, and content. */
export interface IconStackItemLinkProps {
  "aria-label": string
  title: string
  className: string
  children: ReactNode
}

interface IconStackItemBaseProps {
  /** Accessible name, and the tooltip unless `title` is given. */
  label: string
  /** Fuller hover text, when it says more than the accessible name. */
  title?: string
  /** Background of the badge square (any CSS color). */
  color?: string
  size?: IconStackItemSize
  /** The child is a complete mark with its own box and accessible name; render it without a badge square. `color`, `size`, and `overlays` do not apply. */
  selfContained?: boolean
  /** Absolutely positioned sub-badges. They sit outside the clipped square, so they may overhang it. */
  overlays?: ReactNode
  children: ReactNode
}

/** A member is plain, an external link, or a custom link; never two kinds of link at once. */
type IconStackItemLink =
  | {
      /** External URL, opened in a new tab. */
      href?: string
      renderLink?: never
    }
  | {
      href?: never
      /** Renders the link element, e.g. a router's: `(link) => <Link to="/x" {...link} />`. */
      renderLink?: (link: IconStackItemLinkProps) => ReactElement
    }

export type IconStackItemProps = IconStackItemBaseProps & IconStackItemLink

/** One `IconStack` member: a clipped badge square around a glyph, optionally wrapped in a link. */
export const IconStackItem = ({
  label,
  title = label,
  color,
  size = "md",
  selfContained = false,
  overlays,
  href,
  renderLink = href === undefined ? undefined : externalLink(href),
  children,
}: IconStackItemProps): ReactElement => {
  const linked = renderLink !== undefined
  // A link owns the accessible name, so the badge inside it stays nameless.
  const name = linked ? {} : { role: "img", "aria-label": label, title }
  const badge = selfContained ? (
    <span title={linked ? undefined : title} className="inline-flex">
      {children}
    </span>
  ) : (
    <span {...name} className={cn("relative block", ITEM_BOX[size])}>
      <span
        className={cn("flex h-full w-full items-center justify-center overflow-hidden border border-border", ITEM_CLIP[size])}
        style={color === undefined ? undefined : { backgroundColor: color }}
      >
        {children}
      </span>
      {overlays}
    </span>
  )
  return renderLink === undefined ? badge : renderLink({ "aria-label": label, title, className: "inline-flex", children: badge })
}

const externalLink =
  (href: string) =>
  ({ children, ...link }: IconStackItemLinkProps): ReactElement => (
    <a href={href} target="_blank" rel="noreferrer noopener" {...link}>
      {children}
    </a>
  )

const ITEM_BOX: Record<IconStackItemSize, string> = { sm: "h-6 w-6", md: "h-8 w-8" }

const ITEM_CLIP: Record<IconStackItemSize, string> = { sm: "rounded", md: "rounded-md" }
