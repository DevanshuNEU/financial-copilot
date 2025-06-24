import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-green-500 transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }