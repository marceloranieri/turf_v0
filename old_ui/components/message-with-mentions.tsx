"use client"

interface MessageWithMentionsProps {
  content: string
}

export function MessageWithMentions({ content }: MessageWithMentionsProps) {
  const renderContentWithMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g
    const parts = text.split(mentionRegex)

    return parts.map((part, index) => {
      // If this part was captured by the regex (odd indices), it's a username
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            className="bg-violet-600/20 text-violet-300 px-1 py-0.5 rounded hover:bg-violet-600/30 cursor-pointer transition-colors"
          >
            @{part}
          </span>
        )
      }
      return part
    })
  }

  return <div className="text-zinc-200">{renderContentWithMentions(content)}</div>
}
