import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["server/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm"],

  outDir: "./out/api",
})
