import { useState, useEffect, useRef } from "react"

export function useVoiceInput(onTranscript) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)

  // Feature detection
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const isSupported = !!SpeechRecognition

  // Set up Web Speech API
  useEffect(() => {
    if (!isSupported) return

    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("")
      setTranscript(text)
      onTranscript?.(text)
    }

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript("")
    }

    recognition.onend = () => {
      setIsListening(false)
      setTranscript("")
    }

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error)
      setIsListening(false)
      setTranscript("")

      if (e.error !== "aborted") {
        console.warn(`Voice recognition failed: ${e.error}`)
      }
    }

    recognitionRef.current = recognition
    return () => recognition?.abort()
  }, [isSupported, onTranscript, SpeechRecognition])

  const toggleVoice = () => {
    if (!isSupported) return
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  const startVoice = () => {
    if (!isSupported || isListening) return
    recognitionRef.current?.start()
  }

  const stopVoice = () => {
    if (!isSupported || !isListening) return
    recognitionRef.current?.stop()
  }

  return {
    isListening,
    transcript,
    isSupported,
    toggleVoice,
    startVoice,
    stopVoice,
  }
}
