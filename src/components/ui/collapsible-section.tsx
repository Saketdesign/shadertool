
"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className={cn("border-b border-white/10 last:border-0", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors"
            >
                {title}
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {isOpen && (
                <div className="pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    {children}
                </div>
            )}
        </div>
    )
}
