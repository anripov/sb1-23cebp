import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  isScreenSharing: boolean;
  isMuted: boolean;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  messages: Message[];
  token: string | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  addMessage: (message: Message) => void;
  toggleScreenShare: (userId: string) => void;
  toggleMute: (userId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: [],
      messages: [],
      token: null,
      isAuthenticated: false,
      setCurrentUser: (user) => 
        set((state) => {
          const filteredUsers = state.users.filter(u => u.id !== user.id);
          return {
            currentUser: user,
            users: [...filteredUsers, user],
            isAuthenticated: true,
          };
        }),
      setToken: (token) => set({ token, isAuthenticated: true }),
      logout: () => set({ currentUser: null, token: null, isAuthenticated: false }),
      addUser: (user) => 
        set((state) => {
          if (state.users.some(u => u.id === user.id)) {
            return state;
          }
          return { users: [...state.users, user] };
        }),
      removeUser: (userId) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== userId) })),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      toggleScreenShare: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isScreenSharing: !u.isScreenSharing } : u
          ),
          currentUser: state.currentUser?.id === userId 
            ? { ...state.currentUser, isScreenSharing: !state.currentUser.isScreenSharing }
            : state.currentUser
        })),
      toggleMute: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isMuted: !u.isMuted } : u
          ),
          currentUser: state.currentUser?.id === userId 
            ? { ...state.currentUser, isMuted: !state.currentUser.isMuted }
            : state.currentUser
        })),
    }),
    {
      name: 'messenger-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);