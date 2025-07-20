"use client";

import { useCallback, useEffect, useState } from "react";
import { useAgentStore, useStreamStore } from "@/store";
import { StreamPlayer } from "./StreamPlayer";

export default function Avatar() {
  const [error, setError] = useState<string | null>(null);
  const streamData = useStreamStore((state) => state.streamData);
  const setStreamData = useStreamStore((state) => state.setStreamData);
  const setAgentData = useAgentStore((state) => state.setAgentData);

  const createStream = useCallback(async () => {
    setError(null);

    try {
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

  useEffect(() => {
    createStream();
  }, [createStream]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      <StreamPlayer streamData={streamData} />
    </div>
  );
}
