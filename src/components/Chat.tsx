"use client";

import { useState } from "react";
import ChatBox from "./ChatBox";
import Input from "./ui/Input";
import { Plus, Send } from "lucide-react";

type MessageType = {
  role: "user" | "system" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [partial, setPartial] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUserInput = async (text: string) => {
    try {
      setLoading(true);
      const updated: MessageType[] = [...messages, { role: "user", content: text }];
      setMessages(updated);
      setPartial("");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...updated, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl w-full h-full">
      <div className="overflow-hidden hover:overflow-y-auto chat-container flex-1 overflow-y-scroll rounded-xl">
        <ChatBox messages={messages} partial={partial} />
      </div>
      <div className="py-4">
        <Input
          onSubmit={handleUserInput}
          prefix={<Plus />}
          suffix={
            <div className="bg-secondary min-h-full p-2 text-white rounded-full hover:bg-gray-600 transition">
              <Send size={22} className="p-0.5" />
            </div>
          }
          disabled={loading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
