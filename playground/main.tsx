import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { IconStackDemo } from "./icon-stack-demo.tsx"
import "./index.css"

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <main className="mx-auto max-w-4xl p-10">
      <h1 className="mb-8 font-semibold text-xl">IconStack</h1>
      <IconStackDemo />
    </main>
  </StrictMode>,
)
