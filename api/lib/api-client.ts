import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { config } from "dotenv"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

import PKG from "../../package.json"
import { env } from "../../src/env"
import type { AppType } from "../../src/hono"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({
  path: resolve(__dirname, "../.env"),
})
export const createApiClient = (authSessionToken: string) => {
  const apiFetch = ofetch.create({
    baseURL: env.VITE_API_URL,
    credentials: "include",

    retry: false,

    onRequestError(context) {
      if (context.error.name === "AbortError") {
        return
      }
    },
  })

  const apiClient = hc<AppType>("", {
    fetch: async (input, options = {}) => apiFetch(input.toString(), options),
    headers() {
      return {
        "X-App-Version": PKG.version,
        "X-App-Dev": process.env.NODE_ENV === "development" ? "1" : "0",
        Cookie: authSessionToken ? `authjs.session-token=${authSessionToken}` : "",
      }
    },
  })
  return apiClient
}

export const getTokenFromCookie = (cookie: string) => {
  const parsedCookieMap = cookie
    .split(";")
    .map((item) => item.trim())
    .reduce((acc, item) => {
      const [key, value] = item.split("=")
      acc[key] = value
      return acc
    }, {})
  return parsedCookieMap["authjs.session-token"]
}
