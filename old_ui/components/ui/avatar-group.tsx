import * as React from "react"
import { cn } from "@/lib/utils"

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    limit?: number
  }
>(({ className, limit = 3, children, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children)
  const limitedChildren = limit ? childrenArray.slice(0, limit) : childrenArray
  const remainingCount = childrenArray.length - limitedChildren.length

  return (
    <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
      {limitedChildren}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 text-xs font-medium text-zinc-300 border-2 border-zinc-900">
          +{remainingCount}
        </div>
      )}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
