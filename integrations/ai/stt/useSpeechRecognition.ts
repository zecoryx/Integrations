import { useState, useEffect, useRef } from "react";

// TypeScript type definitions for Web Speech API
interface SpeechRecognitionInstance extends EventTarget {
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
  [index: number]: { isFinal: boolean; 0: { transcript: string } };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface UseSpeechRecognitionOptions {
  lang?: string; // e.g. "uz-UZ", "ru-RU", "en-US"
}

// A custom hook for speech recognition using the Web Speech API.
// @param options.lang  BCP-47 language tag. Defaults to "en-US".
// @returns isListening, transcript, error, startListening, stopListening
export const useSpeechRecognition = ({ lang = "en-US" }: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognition = useRef<SpeechRecognitionInstance | null>(null);
  // Accumulates all confirmed (isFinal) speech segments across events
  const accumulatedTranscript = useRef("");

  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError("Web Speech API is not supported by this browser.");
      return;
    }

    const instance: SpeechRecognitionInstance = new SpeechRecognitionAPI();
    recognition.current = instance;

    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = lang;

    instance.onresult = (event: SpeechRecognitionEvent) => {
      let newFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newFinal += event.results[i][0].transcript;
        }
      }
      if (newFinal) {
        // Append newly confirmed words to the running total
        accumulatedTranscript.current += newFinal;
        setTranscript(accumulatedTranscript.current);
      }
    };

    instance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
    };

    instance.onend = () => {
      setIsListening(false);
    };

    return () => instance.stop();
  }, [lang]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      accumulatedTranscript.current = "";
      setTranscript("");
      setError(null);
      recognition.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, error, startListening, stopListening };
}
