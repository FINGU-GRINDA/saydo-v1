"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import { Phone, Users, MousePointerClick, Mic, MicOff, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { CalendarModal } from "./calendar-modal"

interface VoiceCommandModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

// List of commands that the voice recognition can understand
const VOICE_COMMANDS = [
  { command: "record call", action: "/call/1" },
  { command: "start call", action: "/call/1" },
  { command: "record meeting", action: "/call/2" },
  { command: "start meeting", action: "/call/2" },
  { command: "automate task", action: "/call/3" },
  { command: "run task", action: "/call/3" },
  { command: "view calendar", action: "calendar" },
  { command: "show calendar", action: "calendar" },
  { command: "close", action: "close" },
  { command: "cancel", action: "close" },
]

export function VoiceCommandModal({ isOpen, onOpenChange }: VoiceCommandModalProps) {
  const [recognizedCommand, setRecognizedCommand] = useState<string>("");
  const [commandAction, setCommandAction] = useState<string | null>(null);
  const [commandExecuted, setCommandExecuted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRecognizedCommand("");
      setCommandAction(null);
      setCommandExecuted(false);
    }
  }, [isOpen]);
  
  // Handle speech recognition results
  const handleSpeechResult = ({ transcript, isFinal }: { transcript: string; isFinal: boolean }) => {
    const lowerTranscript = transcript.toLowerCase();
    setRecognizedCommand(transcript);
    
    if (isFinal) {
      // Check if the transcript matches any command
      const matchedCommand = VOICE_COMMANDS.find(cmd => 
        lowerTranscript.includes(cmd.command)
      );
      
      if (matchedCommand) {
        setCommandAction(matchedCommand.action);
        setCommandExecuted(true);
        
        // Execute the command after a short delay
        setTimeout(() => {
          if (matchedCommand.action === "close") {
            onOpenChange(false);
          } else if (matchedCommand.action === "calendar") {
            setShowCalendar(true);
          } else {
            window.location.href = matchedCommand.action;
            onOpenChange(false);
          }
        }, 1000);
      }
    }
  };
  
  // Initialize speech recognition
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onEnd: () => {
      // Restart listening if modal is still open and no command was executed
      if (isOpen && !commandExecuted) {
        startListening();
      }
    },
    language: 'en-US'
  });
  
  // Start listening when modal opens
  useEffect(() => {
    if (isOpen && browserSupportsSpeechRecognition && !isListening && !commandExecuted) {
      startListening();
    }
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isOpen, browserSupportsSpeechRecognition, isListening, startListening, stopListening, commandExecuted]);

  return (
    <>
      <CalendarModal 
        isOpen={showCalendar} 
        onOpenChange={(open) => {
          setShowCalendar(open);
          if (!open) {
            // Reset command state when calendar is closed
            setCommandAction(null);
            setCommandExecuted(false);
            setRecognizedCommand("");
            // Restart listening
            if (browserSupportsSpeechRecognition) {
              startListening();
            }
          }
        }} 
      />
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open && isListening) {
          stopListening();
        }
        onOpenChange(open);
      }}>
      <DialogContent className="bg-black/80 backdrop-blur-lg border-0 text-white p-0 w-full h-full max-w-full sm:max-w-lg sm:h-auto sm:rounded-2xl">
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 h-full">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Say It, Saydo It.</h2>

          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-full rounded-full border border-purple-500/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}
            <motion.div
              className={`w-24 h-24 rounded-full shadow-2xl flex items-center justify-center ${commandAction ? 'bg-green-600 shadow-green-600/50' : 'bg-purple-600 shadow-purple-600/50'}`}
              animate={{ scale: commandAction ? [1, 1.2, 1] : [1, 1.05, 1] }}
              transition={{ duration: commandAction ? 0.5 : 1.5, ease: "easeInOut", repeat: commandAction ? 0 : Number.POSITIVE_INFINITY }}
            >
              {commandAction ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              ) : (
                isListening ? (
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                ) : (
                  <MicOff className="w-10 h-10 text-white/70" />
                )
              )}
            </motion.div>
          </div>

          {/* Display recognized speech or status */}
          <div className="min-h-[60px] text-center">
            {!browserSupportsSpeechRecognition ? (
              <p className="text-red-400 mb-8">Your browser doesn't support speech recognition.</p>
            ) : commandAction ? (
              <p className="text-green-400 mb-8">Command recognized: {recognizedCommand}</p>
            ) : recognizedCommand ? (
              <p className="text-gray-300 mb-8">I heard: "{recognizedCommand}"</p>
            ) : (
              <p className="text-gray-400 mb-8">Listening for a command...</p>
            )}
          </div>

          {/* Voice command controls - only show Start Listening when needed */}
          {browserSupportsSpeechRecognition && !commandAction && !isListening && (
            <div className="mb-8">
              <Button 
                onClick={startListening}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Listening
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/call/1"
              className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                stopListening();
                onOpenChange(false);
              }}
            >
              <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800/50">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs">Record Call</span>
            </Link>
            <Link
              href="/call/2"
              className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                stopListening();
                onOpenChange(false);
              }}
            >
              <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800/50">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Record Meeting</span>
            </Link>
            <Link
              href="/call/3"
              className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                stopListening();
                onOpenChange(false);
              }}
            >
              <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800/50">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <span className="text-xs">Automate Task</span>
            </Link>
            <div
              className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              onClick={() => {
                stopListening();
                setShowCalendar(true);
              }}
            >
              <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800/50">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs">View Calendar</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
