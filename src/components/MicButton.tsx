"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface ExtendedWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export default function MicButton({ onTranscript }: MicButtonProps) {
  const [listening, setListening] = useState<boolean>(false);
  const [partialTranscript, setPartialTranscript] = useState<string>("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startBeep = () => new Audio("start.mp3").play();
  const stopBeep = () => new Audio("stop.mp3").play();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extendedWindow = window as ExtendedWindow;
      const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
        extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.warn("SpeechRecognition не підтримується в цьому браузері");
        return;
      }

      const recognition: SpeechRecognition = new SpeechRecognitionAPI();
      recognition.lang = navigator.language || "en-US"; // автоматично, але на 1 мову
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          onTranscript(transcript);
          setPartialTranscript("");
        } else {
          setPartialTranscript(transcript); // показати в реальному часі
        }
      };

      recognition.onend = () => {
        stopBeep();
        setListening(false);
        setPartialTranscript(""); // обнулити при завершенні
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      startBeep();
      recognitionRef.current.start();
    }

    setListening((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleRecording}
        className={`mt-4 flex items-center cursor-pointer gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition ${
          listening ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
        {listening ? "Зупинити запис" : "Говорити"}
      </button>

      {listening && partialTranscript && (
        <div className="mt-2 text-gray-300 text-sm italic animate-pulse">
          {partialTranscript}...
        </div>
      )}
    </div>
  );
}
