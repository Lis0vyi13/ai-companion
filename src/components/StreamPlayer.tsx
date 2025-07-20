import { useDIDStream } from "@/hooks/useDIDStream";
import { StreamParams } from "@/store";
import { useEffect, useRef, useState } from "react";

export const StreamPlayer = ({ streamData }: { streamData: StreamParams | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      } catch (err) {
        console.error("Could not play video", err);
        setIsLoading(false);
      }
    };

    if (video.readyState >= 2) {
      playVideo();
      setIsLoading(false);
    } else {
      video.onloadedmetadata = () => {
        playVideo();
      };
    }

    return () => {
      video.onloadedmetadata = null;
      video.pause();
      video.srcObject = null;
      setIsLoading(true);
    };
  }, [remoteStream]);

  return (
    <div className="mt-4 w-[360px] h-[360px] relative">
      {(isLoading || !streamData) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-10">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        loop
        onError={(e) => console.error("Video error:", e)}
        className="shadow object-cover w-full h-full rounded-full"
      />
    </div>
  );
};
