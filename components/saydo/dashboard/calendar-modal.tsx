"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar as CalendarIcon, CheckCircle, Users, Video } from "lucide-react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useEffect, useRef } from "react"

interface CalendarModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

// Mock data for meetings
const MEETINGS = [
  {
    id: 1,
    title: "Weekly Team Sync",
    date: new Date(2025, 6, 23, 10, 0), // July 23, 2025, 10:00 AM
    duration: 60,
    attendees: ["John Doe", "Jane Smith", "Alex Johnson"],
    platform: "Google Meet",
    platformIcon: Video,
  },
  {
    id: 2,
    title: "Product Review",
    date: new Date(2025, 6, 23, 14, 30), // July 23, 2025, 2:30 PM
    duration: 45,
    attendees: ["Sarah Williams", "Mike Brown", "You"],
    platform: "Zoom",
    platformIcon: Video,
  },
  {
    id: 3,
    title: "Client Presentation",
    date: new Date(2025, 6, 24, 11, 0), // July 24, 2025, 11:00 AM
    duration: 90,
    attendees: ["Client Team", "Sales Team", "You"],
    platform: "Microsoft Teams",
    platformIcon: Video,
  }
]

// Mock data for AI-generated action notes
const AI_ACTIONS = [
  {
    id: 1,
    meetingId: 1,
    text: "Prepare weekly status report with updated metrics",
    completed: false,
  },
  {
    id: 2,
    meetingId: 1,
    text: "Share design mockups with the team before the meeting",
    completed: true,
  },
  {
    id: 3,
    meetingId: 2,
    text: "Review product roadmap and prioritize Q3 features",
    completed: false,
  },
  {
    id: 4,
    meetingId: 2,
    text: "Collect feedback from beta users for discussion",
    completed: false,
  },
  {
    id: 5,
    meetingId: 3,
    text: "Finalize presentation slides with latest case studies",
    completed: false,
  },
  {
    id: 6,
    meetingId: 3,
    text: "Prepare talking points for Q&A session",
    completed: false,
  }
]

export function CalendarModal({ isOpen, onOpenChange }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 6, 23))
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  
  const meetingRefs = useRef<(HTMLDivElement | null)[]>([])
  const actionRefs = useRef<(HTMLDivElement | null)[]>([])
  
  // Filter meetings for the selected date
  const todaysMeetings = MEETINGS.filter(meeting => 
    selectedDate && 
    meeting.date.getDate() === selectedDate.getDate() &&
    meeting.date.getMonth() === selectedDate.getMonth() &&
    meeting.date.getFullYear() === selectedDate.getFullYear()
  )
  
  // Get actions for selected meeting
  const meetingActions = selectedMeeting 
    ? AI_ACTIONS.filter(action => action.meetingId === selectedMeeting)
    : []
  
  // Reset selected meeting when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedMeeting(null)
    }
  }, [isOpen])
  
  // Animation for meetings and actions
  useEffect(() => {
    if (isOpen && todaysMeetings.length > 0) {
      // Animate meetings
      gsap.fromTo(
        meetingRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2
        }
      )
    }
  }, [isOpen, todaysMeetings])
  
  // Animation for actions when a meeting is selected
  useEffect(() => {
    if (selectedMeeting && meetingActions.length > 0) {
      gsap.fromTo(
        actionRefs.current.filter(Boolean),
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.08,
          ease: "power1.out"
        }
      )
    }
  }, [selectedMeeting, meetingActions])
  
  // Format time from Date object
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-6xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-[80vh] max-h-[700px]">
          {/* Calendar sidebar */}
          <div className="w-full md:w-96 bg-gray-50 p-4 border-r border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
            />
          </div>
          
          {/* Meetings and actions */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Meetings list */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Select a date'}
              </h2>
              <p className="text-gray-500 mb-4">
                {todaysMeetings.length} {todaysMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
              </p>
              
              <div className="space-y-3">
                {todaysMeetings.map((meeting, index) => (
                  <div 
                    key={meeting.id}
                    ref={el => meetingRefs.current[index] = el}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMeeting === meeting.id 
                        ? 'bg-black text-white' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMeeting(meeting.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${selectedMeeting === meeting.id ? 'text-white' : 'text-gray-900'}`}>
                        {meeting.title}
                      </h3>
                      <div className={`text-sm ${selectedMeeting === meeting.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        {formatTime(meeting.date)} ({meeting.duration} min)
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <Clock className={`w-4 h-4 mr-1 ${selectedMeeting === meeting.id ? 'text-gray-200' : 'text-gray-400'}`} />
                      <span className={`text-sm ${selectedMeeting === meeting.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        {formatTime(meeting.date)} - {formatTime(new Date(meeting.date.getTime() + meeting.duration * 60000))}
                      </span>
                      <div className="mx-2 text-gray-300">•</div>
                      <Users className={`w-4 h-4 mr-1 ${selectedMeeting === meeting.id ? 'text-gray-200' : 'text-gray-400'}`} />
                      <span className={`text-sm ${selectedMeeting === meeting.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        {meeting.attendees.length} attendees
                      </span>
                      <div className="ml-auto flex items-center">
                        <div className={`flex items-center rounded-full px-2 py-1 text-xs ${
                          selectedMeeting === meeting.id ? 'bg-white/20' : 'bg-gray-200'
                        }`}>
                          <meeting.platformIcon className="w-3 h-3 mr-1" />
                          <span>{meeting.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {todaysMeetings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No meetings scheduled for this day</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* AI-generated actions */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">
                {selectedMeeting 
                  ? `AI-Generated Actions for ${MEETINGS.find(m => m.id === selectedMeeting)?.title}`
                  : 'Select a meeting to view AI-generated actions'}
              </h3>
              
              {selectedMeeting ? (
                <div className="space-y-3">
                  {meetingActions.map((action, index) => (
                    <div 
                      key={action.id}
                      ref={el => actionRefs.current[index] = el}
                      className="opacity-0"
                    >
                      <div className={`flex items-start p-3 rounded-lg bg-white border ${
                        action.completed ? 'border-green-100' : 'border-gray-200'
                      }`}>
                        <div className={`mt-0.5 mr-3 rounded-full p-1 ${
                          action.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {action.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {action.completed ? 'Completed' : 'To do before meeting'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a meeting to view AI-generated action items</p>
                </div>
              )}
              
              {selectedMeeting && meetingActions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No action items for this meeting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
