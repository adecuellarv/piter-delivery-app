import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Home, MapPin, Clock, User } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore";

const ACTIVE_COLOR = "#C86F4F";
const INACTIVE_COLOR = "#7A7A7A";
const TAB_BAR_BG = "#1C1C1C";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = Boolean(user?.token && user?.uid);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E8E3D7" }}>
        <ActivityIndicator color={ACTIVE_COLOR} size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="zonas"
        options={{
          title: "Zonas",
          tabBarIcon: ({ color, size }) => (
            <MapPin color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Clock color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
