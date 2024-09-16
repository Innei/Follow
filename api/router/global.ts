import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path, { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { FastifyRequest } from "fastify"

import { injectMetaHandler } from "../lib/meta-handler"

const require = createRequire(import.meta.url)

const devHandler = (app: App) => {
  app.get("*", async (req, reply) => {
    const url = req.originalUrl

    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

    const vite = require("../lib/dev-vite").getViteServer()
    try {
      let template = readFileSync(path.resolve(root, vite.config.root, "index.html"), "utf-8")

      template = await vite.transformIndexHtml(url, template)

      template = await transfromTemplate(template, req.originalUrl, req)

      reply.type("text/html")
      reply.send(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      reply.code(500).send(e)
    }
  })
}
const handler = (app: App) => {
  app.get("*", async (req, reply) => {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    let template = readFileSync(path.resolve(__dirname, "../web/index.html"), "utf-8")
    template = await transfromTemplate(template, req.originalUrl, req)
    reply.type("text/html")
    reply.send(template)
  })
}

export const globalRoute = process.env.NODE_ENV === "development" ? devHandler : handler

async function transfromTemplate(template: string, url: string, req: FastifyRequest) {
  const dynamicInjectMetaString = await injectMetaHandler(url, req).catch((err) => {
    if (process.env.NODE_ENV === "development") {
      throw err
    }
    return ""
  })
  template = template.replace(`<!-- SSG-META -->`, dynamicInjectMetaString)

  if (dynamicInjectMetaString) {
    template = template.replace(`<!-- SSG-META -->`, dynamicInjectMetaString)

    // Remove <!-- Default Open Graph --> between <!-- End Default Open Graph -->
    const endCommentString = "<!-- End Default Open Graph -->"
    const startIndex = template.indexOf("<!-- Default Open Graph -->")
    const endIndex = template.indexOf(endCommentString)
    template = template.slice(0, startIndex) + template.slice(endIndex + endCommentString.length)
  }

  return template
}
