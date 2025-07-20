"use client";

import { useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import Input from "./ui/Input";
import { Send } from "lucide-react";
import MicButton from "./MicButton";
import { useAgentStore, useAssistantMessages, useStreamStore } from "@/store";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
  created_at: string;
};

const IconAfter = (
  <Button
    size="icon"
    className="h-10 w-10 bg-secondary text-white rounded-full hover:bg-gray-600 transition cursor-pointer"
  >
    <Send size={22} className="text-gray-300" />
  </Button>
);

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const agentData = useAgentStore((state) => state.agentData);
  const streamData = useStreamStore((state) => state.streamData);
  const assistantMessages = useAssistantMessages((state) => state.messages);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;
    try {
      if (!streamData || !agentData) {
        console.error("Stream data is not available");
        return;
      }

      setLoading(true);
      const updated: Message[] = [
        ...messages,
        { role: "user", content: text, created_at: new Date().toISOString() },
      ];
      setMessages(updated);

      const response = await fetch("/api/d-id/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamId: streamData?.id,
          message: text,
          sessionId: streamData?.session_id,
          agent_id: agentData?.agent_id,
          chat_id: agentData?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  useEffect(() => {
    if (!assistantMessages || assistantMessages.length === 0) return;
    setMessages((prev) => [...prev, assistantMessages[assistantMessages.length - 1]]);
    useAssistantMessages.getState().clearMessages();
  }, [assistantMessages]);

  return (
    <div className="flex flex-col max-w-4xl w-full h-full justify-center">
      {hasMessages && (
        <div className="chat-container overflow-y-scroll rounded-xl flex-1">
          <ChatBox messages={messages} loading={loading} />
        </div>
      )}
      <div
        className={cn(
          "py-4",
          !hasMessages &&
            "my-auto min-h-full gap-6 -mt-[12rem] flex flex-col flex-1 justify-center items-center",
        )}
      >
        {!hasMessages && (
          <h1 className="text-center text-3xl font-medium text-black">
            What&apos;s on the agenda today?
          </h1>
        )}
        <Input
          className="transform transition py-3.5"
          name="chatInput"
          ref={inputRef}
          onSend={handleUserInput}
          iconBefore={<MicButton className="ml-0.5" onTranscript={handleUserInput} />}
          iconAfter={IconAfter}
          disabled={loading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
