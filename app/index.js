import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const authUser = useAuthStore((s) => s.authUser);
  const authLoading = useAuthStore((s) => s.authLoading);
  const hydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = Boolean(authUser?.uid);

  if (!hydrated || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8E3D7' }}>
        <ActivityIndicator color="#C2674A" size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/login'} />;
}
