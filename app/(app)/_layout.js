import { Tabs } from "expo-router";
import { Home, MapPin, Clock, User } from "lucide-react-native";

const ACTIVE_COLOR = "#C86F4F";
const INACTIVE_COLOR = "#7A7A7A";
const TAB_BAR_BG = "#1C1C1C";

export default function AppLayout() {
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
