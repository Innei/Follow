import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["server/api/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ["esm"],

  outDir: "./api",
})
