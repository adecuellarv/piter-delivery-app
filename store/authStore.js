import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setSession: (userData) => set({ user: userData }),
      clearSession: () => set({ user: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'piter-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // solo persiste user, no _hasHydrated
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
