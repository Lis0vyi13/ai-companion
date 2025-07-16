"use client";

import { useEffect, useRef } from "react";
import Message from "./Message";

type MessageType = {
  role: "user" | "system" | "assistant";
  content: string;
};

export default function ChatBox({
  messages,
  partial,
}: {
  messages: MessageType[];
  partial: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partial]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} content={msg.content} />
      ))}
      {partial && (
        <div className="text-sm px-3 py-2 rounded-md max-w-[80%] bg-blue-500/40 self-end ml-auto text-blue-100 italic animate-pulse">
          {partial}...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
