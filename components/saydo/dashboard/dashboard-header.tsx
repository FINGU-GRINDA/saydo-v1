"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { SaydoLogo } from "@/components/icons/saydo-logo"

interface DashboardHeaderProps {
  onOpenSettings: () => void
}

export function DashboardHeader({ onOpenSettings }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <SaydoLogo />
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saydo</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onOpenSettings} aria-label="Open settings">
        <Settings className="w-6 h-6 text-gray-500 hover:text-gray-900 transition-colors" />
      </Button>
    </header>
  )
}
