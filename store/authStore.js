import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sanitizeSessionUser = (userData) => {
  if (!userData) return null;

  const { token, ...safeUserData } = userData;
  return safeUserData;
};

const serializeFirebaseUser = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    correo: firebaseUser.email,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    phoneNumber: firebaseUser.phoneNumber,
  };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      authUser: null,
      authLoading: true,
      _hasHydrated: false,

      setSession: (userData) =>
        set((state) => {
          const safeUserData = sanitizeSessionUser(userData);

          return {
            user: safeUserData
              ? {
                  ...safeUserData,
                  uid: safeUserData.uid ?? state.authUser?.uid,
                  correo: safeUserData.correo ?? state.authUser?.correo,
                }
              : null,
          };
        }),
      setAuthUser: (firebaseUser) =>
        set((state) => {
          const authUser = serializeFirebaseUser(firebaseUser);

          if (!authUser) {
            return { authUser: null, authLoading: false, user: null };
          }

          return {
            authUser,
            authLoading: false,
            user: state.user
              ? {
                  ...state.user,
                  uid: state.user.uid ?? authUser.uid,
                  correo: state.user.correo ?? authUser.correo,
                }
              : state.user,
          };
        }),
      setAuthLoading: (value) => set({ authLoading: value }),
      clearSession: () => set({ user: null, authUser: null, authLoading: false }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'piter-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: sanitizeSessionUser(state.user) }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        user: sanitizeSessionUser(persistedState?.user),
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
