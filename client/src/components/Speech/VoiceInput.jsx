import { Mic, MicOff, Volume2 } from "lucide-react"
import { useVoiceInput } from "../../hooks"

export default function VoiceInput({ onTranscript, className = "" }) {
  const { isSupported, isListening, transcript, toggleVoice } =
    useVoiceInput(onTranscript)

  if (!isSupported) return null

  return (
    <div className={className}>
      {/* Microphone Button */}
      <button
        type="button"
        onClick={toggleVoice}
        className={`group relative overflow-hidden rounded-full p-2.5 transition-all duration-200 ${
          isListening
            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
        }`}
        title={isListening ? "Stop voice input" : "Start voice input"}
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
      >
        {/* Animated background pulse */}
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />
        )}

        {/* Icon */}
        <div className="relative z-10">
          {isListening ? (
            <MicOff className="size-4 animate-pulse" />
          ) : (
            <Mic className="size-4 group-hover:scale-110 transition-transform duration-200" />
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:scale-150 transition-all duration-150" />
      </button>

      {/* Voice Status Display */}
      {isListening && (
        <div className="absolute top-full -left-8 md:right-0 mt-2 z-50 ">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Volume2 className="size-4 text-red-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-900">
                  Listening
                </span>
              </div>
              <div className="flex gap-1">
                <div
                  className="w-1 h-1 bg-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1 h-1 bg-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1 h-1 bg-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>

            {transcript ? (
              <div className="text-sm text-gray-700 bg-gray-50 rounded px-2 py-1 border">
                "{transcript}"
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Speak clearly into your microphone...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
