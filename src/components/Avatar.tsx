"use client";

import { useEffect, useRef, useState } from "react";
import { useDIDStream } from "@/hooks/useDIDStream";

export interface StreamParams {
  offer: RTCSessionDescriptionInit;
  id: string;
  ice_servers: RTCIceServer[];
  session_id: string;
}

export const StreamPlayer = ({ streamData }: { streamData: StreamParams }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteStream = useDIDStream({
    offer: streamData?.offer,
    id: streamData?.id,
    ice_servers: streamData?.ice_servers,
    session_id: streamData?.session_id,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!remoteStream || !video) return;

    video.srcObject = remoteStream;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.error("🚫 Не вдалось відтворити відео:", err);
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.onloadedmetadata = () => {
        playVideo();
      };
    }

    return () => {
      video.onloadedmetadata = null;
      video.pause();
      video.srcObject = null;
    };
  }, [remoteStream]);

  if (!streamData) return null;

  return (
    <div className="mt-4 w-[300px] h-[300px] relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
        onError={(e) => console.error("Video error:", e)}
        className="rounded shadow object-cover w-full h-full"
      />
    </div>
  );
};
export default function DidStreamDemo() {
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<StreamParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createStream = async (retries = 3, delay = 1000) => {
    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch("/api/d-id/create-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceUrl: "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg",
          }),
        });
        const data = await res.json();

        console.log("Stream data:", data);

        if (!res.ok) {
          throw new Error(data.error || `Server error (attempt ${attempt})`);
        }

        setStreamData(data);
        setLoading(false);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          const err = error instanceof Error ? error.message : "Unknown error";
          setError(err);
          setLoading(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={() => createStream()}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Создаем стрим..." : "Создать D-ID стрим"}
      </button>

      {error && <p className="mt-4 text-red-600">Ошибка: {error}</p>}

      {streamData && <StreamPlayer streamData={streamData} />}
    </div>
  );
}

// "use client";

// import { useAgentStore } from "@/store";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function Avatar() {

//   return (
//     <div className="space-y-4 max-w-md mx-auto p-4 text-center">
//       {error && <p className="text-red-500">{error}</p>}
//       {videoUrl ? (
//         <video src={videoUrl} controls autoPlay className="w-full rounded shadow-md" />
//       ) : (
//         <Image
//           src="https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg"
//           alt="Agent avatar"
//           width={300}
//           height={300}
//           className="rounded-full mx-auto object-cover shadow"
//         />
//       )}
//     </div>
//   );
// }
