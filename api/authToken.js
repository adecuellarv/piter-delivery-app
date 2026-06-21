import { getFirebaseAuth } from "../config/firebase";

export const getFirebaseIdToken = async () => {
  const auth = getFirebaseAuth();
  await auth.authStateReady?.();

  if (!auth.currentUser) {
    throw new Error("No hay usuario autenticado");
  }

  return auth.currentUser.getIdToken();
};
