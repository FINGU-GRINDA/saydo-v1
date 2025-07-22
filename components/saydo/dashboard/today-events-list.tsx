"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Video, MessageSquare, ExternalLink, Check } from "lucide-react"
import type { HistoryItem } from "@/lib/types"
import gsap from "gsap"

export interface TodayEvent {
  id: string
  title: string
  time: string
  platform: "google_meet" | "slack" | "zoom" | "teams"
  status: "upcoming" | "live" | "completed"
  participants: string[]
  link?: string
}

interface TodayEventsListProps {
  events: TodayEvent[]
}

export function TodayEventsList({ events }: TodayEventsListProps) {
  const [connectedEvents, setConnectedEvents] = useState<Record<string, boolean>>({})
  const eventsRef = useRef<HTMLDivElement>(null)
  const eventRefs = useRef<(HTMLDivElement | null)[]>([])
  
  // Reset refs array when events change
  useEffect(() => {
    eventRefs.current = eventRefs.current.slice(0, events.length)
  }, [events.length])
  
  // Apply GSAP animations when component mounts or events change
  useEffect(() => {
    if (events.length === 0) return
    
    // Clear any existing animations
    gsap.killTweensOf(eventRefs.current)
    
    // Stagger animation for list items
    gsap.fromTo(
      eventRefs.current,
      { 
        y: 20, 
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
      }
    )
    
    // Add hover animations
    eventRefs.current.forEach((card) => {
      if (!card) return
      
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          duration: 0.2,
          ease: "power2.out"
        })
      })
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          duration: 0.2,
          ease: "power2.in"
        })
      })
    })
    
    // Cleanup function
    return () => {
      eventRefs.current.forEach((card) => {
        if (!card) return
        card.removeEventListener("mouseenter", () => {})
        card.removeEventListener("mouseleave", () => {})
      })
    }
  }, [events])

  const handleConnect = (eventId: string) => {
    // Find the event index
    const eventIndex = events.findIndex(event => event.id === eventId)
    
    // Animate the connected event
    if (eventIndex !== -1 && eventRefs.current[eventIndex]) {
      const eventCard = eventRefs.current[eventIndex]
      
      // Create a flash effect
      gsap.to(eventCard, {
        backgroundColor: "rgba(34, 197, 94, 0.1)", // Light green
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(eventCard, {
            backgroundColor: "white",
            duration: 0.5,
            ease: "power2.out"
          })
        }
      })
    }
    
    setConnectedEvents(prev => ({
      ...prev,
      [eventId]: true
    }))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "google_meet":
        return <Video className="w-5 h-5 text-red-500" />
      case "slack":
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case "zoom":
        return <Video className="w-5 h-5 text-blue-500" />
      case "teams":
        return <Video className="w-5 h-5 text-indigo-500" />
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Live Now</span>
      case "upcoming":
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Upcoming</span>
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Completed</span>
      default:
        return null
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "google_meet":
        return "Google Meet"
      case "slack":
        return "Slack Huddle"
      case "zoom":
        return "Zoom"
      case "teams":
        return "MS Teams"
      default:
        return "Meeting"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Today's Events</h2>
        <Button variant="outline" size="sm" className="text-xs">
          <Calendar className="w-4 h-4 mr-1" />
          View Calendar
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No events scheduled for today</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3" ref={eventsRef}>
          {events.map((event, index) => (
            <Card 
              key={event.id} 
              className="overflow-hidden" 
              ref={el => eventRefs.current[index] = el}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    {getPlatformIcon(event.platform)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{event.time}</span>
                      <span className="mx-2">•</span>
                      <span>{getPlatformName(event.platform)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.participants.length > 0 && (
                        <>
                          {event.participants.length > 3
                            ? `${event.participants.slice(0, 2).join(", ")} +${event.participants.length - 2} others`
                            : event.participants.join(", ")}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end">
                  {connectedEvents[event.id] ? (
                    <Button variant="outline" className="text-green-600 border-green-200 bg-green-50" disabled>
                      <Check className="w-4 h-4 mr-1" />
                      Connected
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      {event.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Open
                          </a>
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleConnect(event.id)} 
                        size="sm"
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
