import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { FeedViewType } from "@renderer/lib/enum"
import { subscriptionActions, unreadActions } from "@renderer/store"

export const subscription = {
  byView: (view?: FeedViewType) =>
    defineQuery(
      ["subscriptions", view],
      async () => {
        const [subscriptions, unreads] = await Promise.all([
          subscriptionActions.fetchByView(view),
          unreadActions.fetchUnreadByView(view),
        ])
        return {
          subscriptions,
          unreads,
        }
      },
      {
        rootKey: ["subscriptions"],
      },
    ),
  categories: (view?: number) =>
    defineQuery(["subscription-categories", view], async () => {
      const res = await apiClient.categories.$get({
        query: { view: String(view) },
      })

      return res.data
    }),
}
