import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import middie from "@fastify/middie"
import { config } from "dotenv"
import Fastify from "fastify"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({
  path: resolve(__dirname, "../../.env"),
})
