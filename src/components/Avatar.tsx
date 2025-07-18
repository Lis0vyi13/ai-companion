"use client";

import { useAgentStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Avatar() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const avatarText = useAgentStore((state) => state.avatarText);

  useEffect(() => {
    if (avatarText.length === 0) return;

    const generateAvatar = async () => {
      setVideoUrl(null);
      setError("");

      try {
        const res = await fetch("/api/create-talk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: avatarText }),
        });

        const data = await res.json();

        if (!res.ok || !data.id) {
          throw new Error(data?.error?.message || "Не удалось создать видео.");
        }

        const talkId = data.id;
        console.log("Talk ID:", talkId);

        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = 1000;

        while (attempts < maxAttempts) {
          const statusRes = await fetch(`/api/get-talk?id=${talkId}`);
          const statusData = await statusRes.json();

          if (!statusRes.ok) {
            throw new Error(statusData?.error?.message || "Ошибка при получении статуса.");
          }

          if (statusData.status === "done" && statusData.result_url) {
            setVideoUrl(statusData.result_url);
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          attempts++;
        }

        if (attempts >= maxAttempts) {
          throw new Error("Таймаут ожидания генерации видео.");
        }
      } catch (err) {
        const error =
          typeof err === "object" && err && "message" in err
            ? (err.message as string)
            : "Unknown error";

        setError(error);
      }
    };

    generateAvatar();
  }, [avatarText]);

  return (
    <div className="space-y-4 max-w-md mx-auto p-4 text-center">
      {error && <p className="text-red-500">{error}</p>}
      {videoUrl ? (
        <video src={videoUrl} controls autoPlay className="w-full rounded shadow-md" />
      ) : (
        <Image
          src="https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg"
          alt="Agent avatar"
          className="w-[220px] h-[220px] rounded-full mx-auto object-cover shadow"
        />
      )}
    </div>
  );
}
