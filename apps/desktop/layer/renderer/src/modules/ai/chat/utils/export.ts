import type { UIDataTypes, UIMessage } from "ai"

import type { BizUIMetadata, BizUITools } from "../__internal__/types"

export const exportChatToMarkdown = (
  messages: UIMessage<BizUIMetadata, UIDataTypes, BizUITools>[],
  title?: string,
) => {
  const date = new Date().toLocaleString()
  let markdown = `# ${title || "AI Chat Export"}\n\n`
  markdown += `*Exported on ${date}*\n\n---\n\n`

  messages.forEach((message) => {
    const timestamp = message.metadata?.finishTime
      ? new Date(message.metadata.finishTime).toLocaleString()
      : ""

    if (message.role === "user") {
      markdown += `## 👤 User\n`
      if (timestamp) markdown += `*${timestamp}*\n\n`

      // Extract text content from parts
      const textContent =
        message.parts
          ?.filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n") || ""

      markdown += `${textContent}\n\n`
    } else if (message.role === "assistant") {
      markdown += `## 🤖 ${APP_NAME} AI\n`
      if (timestamp) markdown += `*${timestamp}*\n\n`

      // Extract text content from parts
      const textContent =
        message.parts
          ?.filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n") || ""

      markdown += `${textContent}\n\n`

      // Add tool invocations if any
      const toolParts = message.parts?.filter((part) => part.type.startsWith("tool-"))
      if (toolParts && toolParts.length > 0) {
        markdown += `\n### 🔧 Tools Used:\n`
        toolParts.forEach((tool) => {
          markdown += `- **${tool.type}**\n`
        })
        markdown += "\n"
      }
    }

    markdown += "---\n\n"
  })

  return markdown
}

export const downloadMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
