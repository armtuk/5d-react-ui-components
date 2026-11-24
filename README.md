# 5D React UI Components

React 19 components styled with Tailwind CSS v4. Presentational only: no router, no i18n, no data fetching. Text arrives as props.

## Use

```sh
pnpm add @alexrmturner/5d-react-ui-components
```

Add the stylesheet after Tailwind. It registers the package with Tailwind's scanner, so no `@source` line is needed in the app:

```css
@import "tailwindcss";
@import "@alexrmturner/5d-react-ui-components/styles.css";
```

Borders use the `--color-border` theme token. An app that defines it keeps its own value. Otherwise it falls back to `--border`, then to a tint of the text color.

Peer dependencies: `react` 19, `react-dom` 19, `tailwindcss` 4.

## IconStack

A row of small metadata icons, usually overhanging the corner of a card.

```tsx
import { IconStack, IconStackItem } from "@alexrmturner/5d-react-ui-components"
import { Server } from "lucide-react"

<section className="relative rounded-lg border border-border p-4">
  <IconStack placement={{ edge: "top-right" }}>
    <IconStackItem label="Server" color="#1d4ed8">
      <Server className="h-5 w-5" />
    </IconStackItem>
  </IconStack>
</section>
```

- **Order:** list the most important member first. It takes the corner.
- **Placement:** `{ edge }` is `top-left`, `top-right`, or `bottom-left`, relative to the nearest positioned ancestor. `"inline"` leaves positioning to `className`.
- **Overrides:** `className` wins over the defaults, e.g. `className="-top-4 -right-4"` for larger badges. Other `div` props pass through.
- **Empty:** a stack without members renders nothing.

`IconStackItem` requires a `label`, which is its accessible name and tooltip. `title` supplies fuller hover text. `overlays` adds sub-badges that may overhang the square. `selfContained` renders a child that already has its own box and accessible name; `color`, `size`, and `overlays` do not apply to it.

Link a member with `href` (opens a new tab) or with `renderLink`, which works with any router:

```tsx
<IconStackItem label="Settings" renderLink={(link) => <Link to="/settings" {...link} />}>
  <Settings className="h-5 w-5" />
</IconStackItem>
```

## CornerSlotProvider

An `overflow-hidden` container crops an overhanging stack. Publish an overlay node from outside the clipped box, and edge-anchored stacks inside it portal there:

```tsx
const [cornerSlot, setCornerSlot] = useState<HTMLElement | null>(null)

<section className="relative">
  <div ref={setCornerSlot} className="pointer-events-none absolute inset-0" />
  <CornerSlotProvider value={cornerSlot}>
    <div className="overflow-hidden">{children}</div>
  </CornerSlotProvider>
</section>
```

## Server components

The package works with React Server Components, including the Next.js App Router. `IconStack` and `IconStackItem` can be used directly in a server component, `renderLink` included. `CornerSlotProvider` and `useCornerSlot` hold browser state, so use them from a `"use client"` module.

## Develop

```sh
pnpm install
pnpm dev        # playground
pnpm test
pnpm typecheck
pnpm lint
pnpm build      # dist/
```

Each component has its own folder under `src/`, exports through `src/index.ts`, and has a demo in `playground/`. A module that uses hooks or context starts with `"use client"`. Write Tailwind classes as complete literals, because the scanner cannot see assembled names.

## License

[MIT](LICENSE)
