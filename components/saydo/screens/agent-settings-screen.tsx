"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Mail,
  UserPlus,
  FileText,
  CheckCircle,
  ListChecks,
  Slack,
  TrendingUp,
  KanbanSquare,
} from "lucide-react"

const actionCategories = [
  {
    category: "Core AI",
    description: "Essential summaries and data extraction.",
    actions: [
      {
        id: "generate-summary",
        title: "Generate Summary",
        description: "Create a concise summary of any conversation.",
        Icon: FileText,
        defaultConnected: true,
      },
      {
        id: "extract-action-items",
        title: "Extract Action Items",
        description: "Pull out clear, actionable tasks from a conversation.",
        Icon: ListChecks,
        defaultConnected: true,
      },
    ],
  },
  {
    category: "Communication",
    description: "Automated emails and team updates.",
    actions: [
      {
        id: "draft-email",
        title: "Draft Follow-up Email",
        description: "Write a draft email based on the conversation.",
        Icon: Mail,
        defaultConnected: true,
      },
      {
        id: "share-to-slack",
        title: "Share to Slack",
        description: "Send key summaries or updates to a Slack channel.",
        Icon: Slack,
        defaultConnected: false,
      },
    ],
  },
  {
    category: "CRM & Sales",
    description: "Keep your pipeline up-to-date, automatically.",
    actions: [
      {
        id: "log-activity-in-crm",
        title: "Log Activity in CRM",
        description: "Automatically log calls or meetings in your CRM.",
        Icon: UserPlus,
        defaultConnected: false,
      },
      {
        id: "update-deal-stage",
        title: "Update Deal Stage",
        description: "Update a deal's stage based on conversation.",
        Icon: TrendingUp,
        defaultConnected: false,
      },
    ],
  },
  {
    category: "Scheduling & Tasks",
    description: "Intelligent meeting and task coordination.",
    actions: [
      {
        id: "schedule-meeting",
        title: "Schedule Meeting",
        description: "Identify and suggest meeting times with participants.",
        Icon: Calendar,
        defaultConnected: true,
      },
      {
        id: "create-project-task",
        title: "Create Project Task",
        description: "Add a new task to a project board like Trello or Asana.",
        Icon: KanbanSquare,
        defaultConnected: false,
      },
    ],
  },
]

export function AgentSettingsScreen() {
  const [connectedStatus, setConnectedStatus] = useState(
    actionCategories
      .flatMap((c) => c.actions)
      .reduce(
        (acc, action) => {
          acc[action.id] = action.defaultConnected
          return acc
        },
        {} as Record<string, boolean>,
      ),
  )

  const toggleConnection = (id: string) => {
    setConnectedStatus((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">AI Capabilities</h2>
        <p className="text-gray-600">Connect new skills to your agent to expand its automation powers.</p>
      </div>

      {actionCategories.map((category) => (
        <div key={category.category}>
          <h3 className="text-base font-semibold text-gray-800 mb-1">{category.category}</h3>
          <p className="text-sm text-gray-500 mb-4">{category.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.actions.map((action) => {
              const isConnected = connectedStatus[action.id]
              return (
                <Card key={action.id} className="bg-white shadow-sm border-gray-200 flex flex-col">
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${
                        isConnected ? "bg-black" : "bg-gray-100"
                      }`}
                    >
                      <action.Icon className={`w-5 h-5 ${isConnected ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{action.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-4">
                    <Button
                      onClick={() => toggleConnection(action.id)}
                      variant={isConnected ? "outline" : "default"}
                      className={`w-full ${
                        isConnected
                          ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                          : "bg-black hover:bg-gray-800 text-white"
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Connected
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
