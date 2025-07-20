import { Message } from "@/components/Chat";
import { create } from "zustand";

export interface StreamParams {
  offer: RTCSessionDescriptionInit;
  id: string;
  ice_servers: RTCIceServer[];
  session_id: string;
}

export interface AgentParams {
  agent_id: string;
  agent_id__created_at: string;
  agent_id__modified_at: string;
  chat_mode: string;
  created: string;
  external_id: string;
  id: string;
  messages: {
    messages_url: string;
  }[];
  modified: string;
  owner_id: string;
  persist_messages: boolean;
  plan: string;
}

interface StreamState {
  streamData: StreamParams | null;
  setStreamData: (data: StreamParams) => void;
}

interface AgentState {
  agentData: AgentParams | null;
  setAgentData: (data: AgentParams) => void;
}

interface AssistantStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  streamData: null,
  setStreamData: (data) => set({ streamData: data }),
}));

export const useAgentStore = create<AgentState>((set) => ({
  agentData: null,
  setAgentData: (data) => set({ agentData: data }),
}));

export const useAssistantMessages = create<AssistantStore>((set) => ({
  messages: [],
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
}));
