// @ts-nocheck

import { useState, useEffect, useRef } from "react";

// A custom hook for speech recognition using the Web Speech API.
//
// @returns An object containing the transcript, listening state, error, and functions to start and stop listening.
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Web Speech API is not supported by this browser.");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    const recognitionInstance = recognition.current;

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognitionInstance.onerror = (event) => {
      setError(event.error);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionInstance.stop();
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