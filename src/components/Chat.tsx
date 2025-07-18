"use client";

import { useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import Input from "./ui/Input";
import { Send } from "lucide-react";
import { cn } from "@/utils/cn";
import MicButton from "./MicButton";
import { useAgentStore } from "@/store";

type MessageType = {
  role: "user" | "system" | "assistant";
  content: string;
};

const IconAfter = (
  <div className="bg-secondary min-h-full p-3 text-white rounded-full hover:bg-gray-600 transition">
    <Send size={22} className="p-0.5" />
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setAvatarText = useAgentStore((state) => state.setAvatarText);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const updated: MessageType[] = [...messages, { role: "user", content: text }];
      setMessages(updated);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...updated, { role: "assistant", content: data.reply }]);
        setAvatarText(data.reply);
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
            "my-auto min-h-full gap-6 -mt-[7rem] flex flex-col flex-1 justify-center items-center",
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
          iconBefore={<MicButton onTranscript={handleUserInput} />}
          iconAfter={IconAfter}
          disabled={loading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
