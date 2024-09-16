import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["api/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ["esm"],

  outDir: "./out/server",
})
