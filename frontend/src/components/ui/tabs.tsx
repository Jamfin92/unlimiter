import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={className} data-active-tab={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ value?: string; activeTab?: string; onTabChange?: (v: string) => void }>(child)) {
          return React.cloneElement(child, { activeTab: value, onTabChange: onValueChange } as Record<string, unknown>)
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  activeTab?: string
  onTabChange?: (value: string) => void
}

export function TabsList({ children, className, activeTab, onTabChange }: TabsListProps) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ activeTab?: string; onTabChange?: (v: string) => void }>(child)) {
          return React.cloneElement(child, { activeTab, onTabChange } as Record<string, unknown>)
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  activeTab?: string
  onTabChange?: (value: string) => void
}

export function TabsTrigger({ value, children, className, activeTab, onTabChange }: TabsTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        activeTab === value && "bg-background text-foreground shadow-sm",
        className
      )}
      onClick={() => onTabChange?.(value)}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  activeTab?: string
}

export function TabsContent({ value, children, className, activeTab }: TabsContentProps) {
  if (activeTab !== value) return null
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  )
}
