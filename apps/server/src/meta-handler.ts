import type { FastifyRequest } from "fastify"

import { createApiClient, getTokenFromCookie } from "./lib/api-client"

interface MetaTagdata {
  type: "meta"
  property: string
  content: string
}

interface MetaTitle {
  type: "title"
  title: string
}

interface MetaHydrateData {
  type: "hydrate"
  data: any
  path: string
  key: string
}
export type MetaTag = MetaTagdata | MetaTitle | MetaHydrateData

export async function injectMetaHandler(req: FastifyRequest): Promise<MetaTag[]> {
  const metaArr = [] as MetaTag[]

  const apiClient = createApiClient(getTokenFromCookie(req.headers.cookie || ""))

  const hostFromReq = req.headers.host
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https"

  const url = req.originalUrl

  switch (true) {
    case url.startsWith("/share/feeds"): {
      const parsedUrl = new URL(url, `https://${hostFromReq}`)
      const feedId = parsedUrl.pathname.split("/")[3]

      const feed = await apiClient.feeds.$get({ query: { id: feedId } })

      const { title, description } = feed.data.feed
      metaArr.push(
        {
          type: "meta",
          property: "og:image",
          content: `${protocol}://${hostFromReq}/og/feed/${feedId}`,
        },
        {
          type: "meta",
          property: "og:description",
          content: description || "",
        },
        {
          type: "title",
          title: title || "",
        },
        {
          type: "hydrate",
          data: feed.data,
          path: apiClient.feeds.$url({ query: { id: feedId } }).pathname,
          key: `feeds.$get,query:id=${feedId}`,
        },
      )
    }
  }

  return metaArr
}
