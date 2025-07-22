"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechRecognitionResult {
  transcript: string
  isFinal: boolean
}

interface UseSpeechRecognitionProps {
  onResult?: (result: SpeechRecognitionResult) => void
  onEnd?: () => void
  language?: string
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  browserSupportsSpeechRecognition: boolean
}

// Define the SpeechRecognition type
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
        confidence: number
      }
      isFinal: boolean
      length: number
    }
    length: number
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: Event) => void
  onend: (event: Event) => void
  onresult: (event: SpeechRecognitionEvent) => void
  onspeechstart: (event: Event) => void
  onspeechend: (event: Event) => void
}

// Get the SpeechRecognition constructor
const SpeechRecognitionAPI = 
  typeof window !== 'undefined' 
    ? (window.SpeechRecognition || 
       (window as any).webkitSpeechRecognition) 
    : null

export function useSpeechRecognition({
  onResult,
  onEnd,
  language = 'en-US'
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [browserSupports, setBrowserSupports] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI() as SpeechRecognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language
      setRecognition(recognition)
      setBrowserSupports(true)
    }
  }, [language])

  // Handle recognition results
  useEffect(() => {
    if (!recognition) return

    const handleResult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)

      if (onResult) {
        onResult({
          transcript: currentTranscript,
          isFinal: !!finalTranscript
        })
      }
    }

    const handleEnd = () => {
      setIsListening(false)
      if (onEnd) onEnd()
    }

    recognition.onresult = handleResult
    recognition.onend = handleEnd

    return () => {
      recognition.onresult = null
      recognition.onend = null
    }
  }, [recognition, onResult, onEnd])

  // Start listening
  const startListening = useCallback(() => {
    if (!recognition) return

    try {
      recognition.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error starting speech recognition:', error)
    }
  }, [recognition])

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognition) return

    try {
      recognition.stop()
      setIsListening(false)
    } catch (error) {
      console.error('Error stopping speech recognition:', error)
    }
  }, [recognition])

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: browserSupports
  }
}
