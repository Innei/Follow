import "./lib/load-env"

import { createRequire } from "node:module"

import middie from "@fastify/middie"
import Fastify from "fastify"

import { globalRoute } from "./router/global"
import { ogRoute } from "./router/og"

const app = Fastify({})

await app.register(middie, {
  hook: "onRequest",
})

const require = createRequire(import.meta.url)

if (process.env.NODE_ENV === "development") {
  const devVite = require("./lib/dev-vite")
  await devVite.registerDevViteServer(app)
}

ogRoute(app)
globalRoute(app)

const isVercel = process.env.VERCEL === "1"
if (!isVercel) {
  await app.listen({ port: 2233 })
  console.info("Server is running on http://localhost:2233")
}

export { app }
