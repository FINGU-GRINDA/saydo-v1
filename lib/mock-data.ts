import { TodayEvent } from "@/components/saydo/dashboard/today-events-list"
import type { HistoryItem } from "@/lib/types"

const now = new Date()

// Mock data for history items
export const mockHistory: HistoryItem[] = [
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

// Mock data for today's events
export const mockTodayEvents: TodayEvent[] = [
  {
    id: "event-1",
    title: "Weekly Team Standup",
    time: "9:00 AM - 9:30 AM",
    platform: "google_meet",
    status: "completed",
    participants: ["Alex Kim", "Sarah Johnson", "Michael Chen", "Jessica Lee", "David Park"],
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "event-2",
    title: "Product Demo with Acme Corp",
    time: "11:00 AM - 12:00 PM",
    platform: "zoom",
    status: "completed",
    participants: ["John Smith", "Emma Wilson", "Robert Brown"],
    link: "https://zoom.us/j/123456789"
  },
  {
    id: "event-3",
    title: "Engineering Sync",
    time: "2:00 PM - 3:00 PM",
    platform: "slack",
    status: "live",
    participants: ["Dev Team", "Product Team"],
    link: "https://slack.com/channels/engineering-sync"
  },
  {
    id: "event-4",
    title: "Client Onboarding: TechStart Inc",
    time: "4:30 PM - 5:30 PM",
    platform: "teams",
    status: "upcoming",
    participants: ["Lisa Wong", "Mark Davis", "Jennifer Taylor"],
    link: "https://teams.microsoft.com/l/meetup-join/abc123"
  }
]
