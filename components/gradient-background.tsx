import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"

interface GradientBackgroundProps {
  children: ReactNode
  className?: string
  intensity?: "subtle" | "medium" | "strong"
  showFooter?: boolean
}

export function GradientBackground({
  children,
  className,
  intensity = "medium",
  showFooter = false,
}: GradientBackgroundProps) {
  const gradients = {
    subtle: "from-blue-600/80 via-blue-500/80 to-indigo-600/80",
    medium: "from-blue-600 via-blue-500 to-indigo-600",
    strong: "from-blue-700 via-purple-600 to-indigo-800",
  }

  return (
    <div
      className={cn(
        "relative min-h-screen-safe overflow-hidden",
        `bg-gradient-to-br ${gradients[intensity]}`,
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-glow animate-delay-300"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>
      <div className="relative z-10 h-full min-h-screen-safe flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}
