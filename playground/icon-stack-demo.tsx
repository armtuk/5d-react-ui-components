import { Check, Database, Lock, Server, Zap } from "lucide-react"
import { type ReactElement, type ReactNode, useState } from "react"
import { CornerSlotProvider, IconStack, IconStackItem } from "../src/index.ts"

export const IconStackDemo = (): ReactElement => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
    <Card title="Top right: first member in the corner">
      <IconStack placement={{ edge: "top-right" }}>
        <ServerItem />
        <DatabaseItem />
      </IconStack>
    </Card>
    <Card title="Top left">
      <IconStack placement={{ edge: "top-left" }}>
        <ServerItem />
        <DatabaseItem />
      </IconStack>
    </Card>
    <Card title="Bottom left, small">
      <IconStack placement={{ edge: "bottom-left" }}>
        <IconStackItem label="Locked" size="sm" color="#b45309">
          <Lock className="h-3.5 w-3.5" />
        </IconStackItem>
      </IconStack>
    </Card>
    <Card title="Overlay badge">
      <IconStack placement={{ edge: "top-right" }}>
        <IconStackItem label="Server, healthy" color="#1d4ed8" overlays={<HealthyOverlay />}>
          <Server className="h-5 w-5" />
        </IconStackItem>
      </IconStack>
    </Card>
    <Card title="External link and custom link element">
      <IconStack placement={{ edge: "top-right" }}>
        <IconStackItem label="Open example.com" href="https://example.com" color="#047857">
          <Zap className="h-5 w-5" />
        </IconStackItem>
        <IconStackItem
          label="In-page link"
          color="#7c3aed"
          renderLink={({ children, ...link }) => (
            <a href="#in-page" {...link}>
              {children}
            </a>
          )}
        >
          <Database className="h-5 w-5" />
        </IconStackItem>
      </IconStack>
    </Card>
    <Card title="Inline: owner-positioned">
      <IconStack placement="inline" className="mt-3 justify-center">
        <ServerItem />
        <DatabaseItem />
      </IconStack>
    </Card>
    <ClippedCard title="Clipped body, with corner slot">
      <IconStack placement={{ edge: "top-right" }}>
        <ServerItem />
      </IconStack>
    </ClippedCard>
    <Card title="Clipped body, without corner slot" className="overflow-hidden">
      <IconStack placement={{ edge: "top-right" }}>
        <ServerItem />
      </IconStack>
    </Card>
  </div>
)

interface CardProps {
  title: string
  className?: string
  children: ReactNode
}

const Card = ({ title, className = "", children }: CardProps): ReactElement => (
  <section className={`relative min-h-28 rounded-lg border border-border p-4 ${className}`}>
    <h2 className="text-sm">{title}</h2>
    {children}
  </section>
)

const ClippedCard = ({ title, children }: CardProps): ReactElement => {
  const [cornerSlot, setCornerSlot] = useState<HTMLElement | null>(null)
  return (
    <section className="relative min-h-28 rounded-lg border border-border p-4">
      <div ref={setCornerSlot} className="pointer-events-none absolute inset-0" />
      <h2 className="text-sm">{title}</h2>
      <CornerSlotProvider value={cornerSlot}>
        <div className="relative overflow-hidden">{children}</div>
      </CornerSlotProvider>
    </section>
  )
}

const ServerItem = (): ReactElement => (
  <IconStackItem label="Server" color="#1d4ed8">
    <Server className="h-5 w-5" />
  </IconStackItem>
)

const DatabaseItem = (): ReactElement => (
  <IconStackItem label="Database" color="#7c3aed">
    <Database className="h-5 w-5" />
  </IconStackItem>
)

const HealthyOverlay = (): ReactElement => (
  <span aria-hidden="true" className="-right-1 -bottom-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600">
    <Check className="h-2.5 w-2.5" />
  </span>
)
