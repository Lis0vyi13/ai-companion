"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
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

export default function MicButton({ onTranscript, className }: MicButtonProps) {
  const [listening, setListening] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startBeep = () => new Audio("start.mp3").play();
  const stopBeep = () => new Audio("stop.mp3").play();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extendedWindow = window as ExtendedWindow;
      const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
        extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.warn("SpeechRecognition is not supported in this browser");
        return;
      }

      const recognition: SpeechRecognition = new SpeechRecognitionAPI();
      recognition.lang = navigator.language || "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          onTranscript(transcript);
        }
      };

      recognition.onend = () => {
        stopBeep();
        setListening(false);
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
      <Button
        variant={listening ? "destructive" : "secondary"}
        onClick={toggleRecording}
        className={cn(
          "rounded-full w-10 h-10 flex items-center justify-center cursor-pointer",
          className,
        )}
      >
        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-white" />}
      </Button>
    </div>
  );
}
