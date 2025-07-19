import { StreamParams } from "@/components/Avatar";
import { useEffect, useRef, useState } from "react";

export function useDIDStream({ offer, id, session_id, ice_servers }: StreamParams) {
  const [sdpAnswer, setSdpAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [connectionState, setConnectionState] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const createPeerConnection = async () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      const pc = new RTCPeerConnection({ iceServers: ice_servers });
      peerConnectionRef.current = pc;

      pc.ontrack = (event: RTCTrackEvent) => {
        if (!isMounted || !event.streams[0]) return;
        console.log("📡 onTrack event:", event.streams);
        setRemoteStream(event.streams[0]);
      };

      try {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (isMounted) {
          setSdpAnswer(answer);
        }
      } catch (err) {
        console.error("Error setting up peer connection:", err);
      }

      pc.onicecandidate = async (event) => {
        if (event.candidate && id && session_id) {
          try {
            await fetch(`/api/d-id/ice/${id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                session_id,
              }),
            });
          } catch (err) {
            console.error("Error sending ICE candidate:", err);
          }
        }
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        console.log("ICE state changed:", state);
        if (isMounted) {
          setConnectionState(state);
          if (["failed", "disconnected"].includes(state)) {
            console.warn("ICE connection issue:", state);
            createPeerConnection();
          }
        }
      };
    };

    createPeerConnection();

    return () => {
      isMounted = false;
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [ice_servers, offer, id, session_id]);

  useEffect(() => {
    if (!sdpAnswer || !id || !session_id) return;

    const startStream = async () => {
      try {
        const res = await fetch("/api/d-id/sdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: sdpAnswer,
            stream_id: id,
            session_id,
          }),
        });
        await res.json();
      } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown error";
        console.log("Error starting stream:", err);
      }
    };

    startStream();
  }, [id, sdpAnswer, session_id]);

  useEffect(() => {
    if ((connectionState !== "connected" && connectionState !== "completed") || !session_id) return;

    const createTalk = async () => {
      try {
        const response = await fetch(`/api/d-id/create-talk/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id }),
        });

        if (!response.ok) {
          console.error("respo,", response);
        }

        await response.json();
      } catch (error) {
        console.error(
          "Error creating talk:",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    };

    createTalk();
  }, [connectionState, id, session_id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (id && session_id) {
        navigator.sendBeacon(`/api/d-id/stop-stream/${id}?session_id=${session_id}`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, session_id]);
  return remoteStream;
}
