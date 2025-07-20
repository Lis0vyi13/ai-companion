import { Message } from "@/components/Chat";
import { StreamParams, useAgentStore, useAssistantMessages } from "@/store";
import { useEffect, useRef, useState } from "react";

export function useDIDStream({ offer, id, session_id, ice_servers }: Partial<StreamParams>) {
  const [sdpAnswer, setSdpAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [connectionState, setConnectionState] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const addMessage = useAssistantMessages((state) => state.addMessage);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const agentData = useAgentStore((state) => state.agentData);

  useEffect(() => {
    if (!offer || !id || !session_id || !ice_servers) return;

    let isMounted = true;

    const createPeerConnection = async () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      const pc = new RTCPeerConnection({ iceServers: ice_servers });
      peerConnectionRef.current = pc;

      const dc = pc.createDataChannel("JanusDataChannel");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("Data channel opened");
      };

      dc.onmessage = (event) => {
        const msg = event.data;
        const msgType = "chat/answer:";
        if (msg.includes(msgType) && isMounted) {
          const content = decodeURIComponent(msg.replace(msgType, ""));
          const newMessage: Message = {
            role: "assistant",
            content,
            created_at: new Date().toISOString(),
          };
          addMessage(newMessage);
        } else if (msg.includes("stream/started")) {
          console.log("Stream started:", msg);
        } else {
          console.log("Other message:", msg);
        }
      };

      dc.onclose = () => {
        console.log("Data channel closed");
      };

      pc.ontrack = (event: RTCTrackEvent) => {
        if (!isMounted || !event.streams[0]) return;

        const stream = event.streams[0];
        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();

        if (videoTracks.length !== 0) {
          const combinedTracks = [videoTracks[0], ...audioTracks];
          const filteredStream = new MediaStream(combinedTracks);
          setRemoteStream(filteredStream);
        }
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
        if (event.candidate && id && session_id && agentData) {
          try {
            await fetch(`/api/d-id/ice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                session_id,
                agent_id: agentData?.agent_id,
                stream_id: id,
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
          if (["failed, disconnected"].includes(state)) {
            console.warn("ICE connection issue:", state);
            createPeerConnection();
          }
        }
      };
    };

    createPeerConnection();

    return () => {
      isMounted = false;
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [ice_servers, offer, id, session_id, agentData, addMessage]);

  useEffect(() => {
    if (!sdpAnswer || !id || !session_id || !agentData) return;

    const startStream = async () => {
      try {
        const res = await fetch("/api/d-id/sdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: sdpAnswer,
            stream_id: id,
            session_id,
            agent_id: agentData?.agent_id,
          }),
        });
        await res.json();
      } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown error";
        console.log("Error starting stream:", err);
      }
    };

    startStream();
  }, [agentData, id, sdpAnswer, session_id]);

  useEffect(() => {
    if (
      (connectionState !== "connected" && connectionState !== "completed") ||
      !session_id ||
      !agentData
    )
      return;

    const createTalk = async () => {
      try {
        const response = await fetch(`/api/d-id/create-video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id, stream_id: id, agent_id: agentData?.agent_id }),
        });

        if (!response.ok) {
          console.error("Response error:", response);
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
  }, [agentData, connectionState, id, session_id]);

  return remoteStream;
}
