import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../config/firebase";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setAuthUser(firebaseUser);
        },
        (error) => {
          console.error("Error escuchando Firebase Auth:", error);
          setAuthUser(null);
        }
      );
    } catch (error) {
      console.error("Error inicializando Firebase Auth:", error);
      setAuthUser(null);
    }

    return unsubscribe;
  }, [setAuthUser]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      const wasInactive = /inactive|background/.test(appState.current);
      appState.current = nextAppState;

      if (!wasInactive || nextAppState !== "active") {
        return;
      }

      setAuthLoading(true);

      try {
        const auth = getFirebaseAuth();
        await auth.authStateReady?.();

        if (auth.currentUser) {
          await auth.currentUser.getIdToken();
        }

        setAuthUser(auth.currentUser);
      } catch (error) {
        console.error("Error restaurando Firebase Auth al volver a foreground:", error);
        setAuthUser(null);
      }
    });

    return () => subscription.remove();
  }, [setAuthLoading, setAuthUser]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
