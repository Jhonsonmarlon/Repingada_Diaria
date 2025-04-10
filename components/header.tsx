"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle, BarChart2, RefreshCw, User } from "lucide-react"

interface HeaderProps {
  onReiniciar: () => void
  onShowRanking: () => void
  onShowHelp: () => void
  onShowSettings: () => void
}

export default function Header({ onReiniciar, onShowRanking, onShowHelp, onShowSettings }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center py-2 mb-4">
      <Button variant="ghost" size="icon" className="text-white" onClick={onShowHelp}>
        <HelpCircle className="h-6 w-6" />
      </Button>

      <h1 className="text-2xl font-bold text-white tracking-wider whitespace-nowrap">REPINGADA DIÁRIA</h1>

      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="text-white" onClick={onReiniciar}>
          <RefreshCw className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={onShowRanking}>
          <BarChart2 className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={onShowSettings}>
          <User className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}
