"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart2, 
  Database, 
  History, 
  Home,
  BookOpen,
  Brain,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Generated Data", href: "/generated-data", icon: Database },
  { name: "Numerical Analysis", href: "/analysis", icon: BarChart2 },
  { name: "Data Insights", href: "/insights", icon: Brain },
  { name: "Machine Learning", href: "/ml", icon: BookOpen },
  { name: "Generation History", href: "/history", icon: History },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col border-r bg-card",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <h1 className={cn(
          "font-semibold tracking-tight transition-all",
          isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
        )}>
          Data Alchemy
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid gap-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent" : "transparent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className={cn(
                  "transition-all",
                  isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
          <div className={cn(
            "transition-all",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}>
            <p className="text-sm font-medium">Data Scientist</p>
            <p className="text-xs text-muted-foreground">admin@dataalchemy.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}