import { create } from 'zustand';
import { Profile, VerificationResult } from './types';

interface AuthStore {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: { id: string; email: string } | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (loading: boolean) => void;
}

interface ArenaStore {
  currentClaimIndex: number;
  score: number;
  userAnswers: Record<string, string>;
  setCurrentClaimIndex: (index: number) => void;
  incrementScore: () => void;
  recordAnswer: (claimId: string, answer: string) => void;
  reset: () => void;
}

interface OverlayStore {
  isOpen: boolean;
  selectedText: string;
  verificationResult: VerificationResult | null;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  setSelectedText: (text: string) => void;
  setVerificationResult: (result: VerificationResult | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export const useArenaStore = create<ArenaStore>((set) => ({
  currentClaimIndex: 0,
  score: 0,
  userAnswers: {},
  setCurrentClaimIndex: (index) => set({ currentClaimIndex: index }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  recordAnswer: (claimId, answer) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [claimId]: answer },
    })),
  reset: () => set({ currentClaimIndex: 0, score: 0, userAnswers: {} }),
}));

export const useOverlayStore = create<OverlayStore>((set) => ({
  isOpen: false,
  selectedText: '',
  verificationResult: null,
  isLoading: false,
  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedText: (text) => set({ selectedText: text }),
  setVerificationResult: (result) => set({ verificationResult: result }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
