"use client";

import { useCallback, useState } from "react";
import { useAgentStore, useStreamStore } from "@/store";
import { StreamPlayer } from "./StreamPlayer";
import { Button } from "./ui/Button";

export default function Avatar() {
  const [error, setError] = useState<string | null>(null);
  const streamData = useStreamStore((state) => state.streamData);
  const [streaming, setStreaming] = useState(false);
  const setStreamData = useStreamStore((state) => state.setStreamData);
  const setAgentData = useAgentStore((state) => state.setAgentData);

  const createStream = useCallback(async () => {
    setError(null);

    try {
      setStreaming(true);
      const chatRes = await fetch("/api/d-id/create-chat/v2_agt_QptPA_iB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const chatData = await chatRes.json();

      if (!chatRes.ok) {
        throw new Error(chatData?.error?.message || "Could not create chat");
      }
      setAgentData(chatData);

      const streamRes = await fetch("/api/d-id/create-stream/v2_agt_QptPA_iB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const streamData = await streamRes.json();

      if (!streamRes.ok) {
        throw new Error(streamData?.error?.message || "Could not create stream");
      }

      setStreamData(streamData);
    } catch (error) {
      const err = error instanceof Error ? error.message : "Unknown error";
      setError(err);
      console.error("Error:", err);
    }
  }, [setAgentData, setStreamData]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {streaming ? (
        <StreamPlayer streamData={streamData} />
      ) : (
        <div className="mt-4 w-[360px] h-[360px] relative">
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-10">
            <Button
              variant="outline"
              className="cursor-pointer hover:bg-gray-300 transition duration-300 capitalize"
              onClick={createStream}
            >
              Start conversation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
