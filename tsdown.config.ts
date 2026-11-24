import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"],
  platform: "browser",
  target: "es2022",
  dts: true,
  unbundle: true,
  fixedExtension: false,
  copy: ["src/styles.css"],
})
