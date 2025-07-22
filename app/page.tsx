"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/saydo/dashboard/dashboard-header"
import { BottomNavBar } from "@/components/saydo/layout/bottom-nav-bar"
import { HomeScreen } from "@/components/saydo/screens/home-screen"
import { AgentSettingsScreen } from "@/components/saydo/screens/agent-settings-screen"
import { VoiceCommandModal } from "@/components/saydo/dashboard/voice-command-modal"
import type { HistoryItem } from "@/lib/types"

export type ActiveTab = "home" | "agent"

const now = new Date()
const mockHistory: HistoryItem[] = [
  {
    id: "1",
    title: "Call with Alex Kim",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    duration: "8m 42s",
    type: "call",
    summary:
      "Inquired about Vercel AI SDK for a cloud migration project. A technical demo was scheduled for next Wednesday.",
    pendingActions: true,
  },
  {
    id: "2",
    title: "Meeting with Samantha Lee",
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    duration: "45m 15s",
    type: "meeting",
    summary:
      "Finalized enterprise pricing and discussed the onboarding timeline. Ready to move forward with the contract.",
    pendingActions: true,
  },
  {
    id: "3",
    title: "Call with David Chen",
    timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000),
    duration: "5m 30s",
    type: "call",
    summary: "Reported a minor issue with the dashboard display. A support ticket has been created.",
    pendingActions: false,
  },
  {
    id: "4",
    title: "Meeting with Maria Garcia",
    timestamp: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    duration: "30m 02s",
    type: "meeting",
    summary:
      "Explored a potential partnership opportunity. A follow-up meeting with the partnerships team is required.",
    pendingActions: true,
  },
  {
    id: "5",
    title: "Browser Task: Scrape Leads",
    timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    duration: "3m 12s",
    type: "browser_task",
    summary: "Scraped 50 new leads from LinkedIn Sales Navigator based on the 'SaaS Founders' search criteria.",
    pendingActions: false,
  },
]

export default function SaydoApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home")
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "agent":
        return <AgentSettingsScreen />
      case "home":
      default:
        return <HomeScreen history={mockHistory} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
        <DashboardHeader onOpenSettings={() => setActiveTab("agent")} />
        {renderContent()}
      </div>
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCommandClick={() => setIsVoiceModalOpen(true)}
      />
      <VoiceCommandModal isOpen={isVoiceModalOpen} onOpenChange={setIsVoiceModalOpen} />
    </div>
  )
}
