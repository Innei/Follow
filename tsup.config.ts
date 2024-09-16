import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["server/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ["esm"],

  outDir: "./out/server",
})
