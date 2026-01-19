// @ts-nocheck

import { useState, useEffect } from "react";

// A custom hook for text-to-speech functionality using the Web Speech API.

// @returns An object containing the speaking state, error, and a function to speak the given text.
export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setError("Web Speech API is not supported by this browser.");
    }
  }, []);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        setError(event.error);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setError("Web Speech API is not supported by this browser.");
    }
  };

  return { isSpeaking, error, speak };
}