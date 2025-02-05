"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-end space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}