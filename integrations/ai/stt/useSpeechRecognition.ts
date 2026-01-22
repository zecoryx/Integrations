// @ts-nocheck

import { useState, useEffect, useRef } from "react";

// TypeScript type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  transcript: string;
  0: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// A custom hook for speech recognition using the modern Web Speech API.
//
// @returns An object containing the transcript, listening state, error, and functions to start and stop listening.
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support using the standard API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Web Speech API is not supported by this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognition.current = recognitionInstance;

    // Configure recognition settings
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    // Handle recognition results
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    // Handle recognition errors
    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
    };

    // Handle recognition end
    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    // Cleanup function
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition.current && !isListening) {
      recognition.current.start();
      setIsListening(true);
      setError(null);
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
