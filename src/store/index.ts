import { create } from "zustand";

interface AgentState {
  avatarText: string;
  setAvatarText: (text: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  avatarText: "",
  setAvatarText: (text) => set({ avatarText: text }),
}));
