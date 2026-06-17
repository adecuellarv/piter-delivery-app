import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Pencil, Bell, HelpCircle, ChevronRight, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
const BG = "#EAE4D9";
const ACCENT = "#C86F4F";

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function MenuItem({ icon: Icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#F0EBE3",
      }}
    >
      <Icon size={20} color={ACCENT} strokeWidth={1.8} style={{ marginRight: 14 }} />
      <Text style={{ flex: 1, fontSize: 15, color: "#2D2D2D", fontWeight: "500" }}>{label}</Text>
      <ChevronRight size={18} color="#BFBAB4" strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  // Datos del conductor (usar los del store cuando el API esté listo)
  const nombre = user?.nombre ?? "Fernando Gonzalin";
  const correo = user?.correo ?? "fernando@example.com";
  const telefono = user?.telefono ?? "+52 448 102 5002";
  const entregas = user?.entregas ?? 128;
  const initials = getInitials(nombre);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          clearSession();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}>
        {/* Avatar + info */}
        <View style={{ alignItems: "center", paddingTop: 28, paddingBottom: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: ACCENT,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700" }}>{initials}</Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: "700", color: "#1A1815", marginBottom: 4 }}>
            {nombre}
          </Text>
          <Text style={{ fontSize: 14, color: ACCENT, textDecorationLine: "underline", marginBottom: 4 }}>
            {correo}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B6560" }}>{telefono}</Text>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#1A1815" }}>{entregas}</Text>
            <Text style={{ fontSize: 13, color: "#7A7570", marginTop: 2 }}>Entregas</Text>
          </View>
        </View>

        {/* Menu */}
        <View
          style={{
            marginHorizontal: 24,
            backgroundColor: "#fff",
            borderRadius: 18,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 20,
          }}
        >
          <MenuItem icon={Pencil} label="Editar perfil" onPress={() => {}} />
          <MenuItem icon={Bell} label="Notificaciones" onPress={() => {}} />
          <View style={{ borderBottomWidth: 0 }}>
            <MenuItem icon={HelpCircle} label="Ayuda y soporte" onPress={() => {}} />
          </View>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={{
            marginHorizontal: 24,
            borderWidth: 1.5,
            borderColor: ACCENT,
            borderRadius: 16,
            paddingVertical: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#FFF8F5",
          }}
        >
          <LogOut size={20} color={ACCENT} strokeWidth={1.8} />
          <Text style={{ color: ACCENT, fontSize: 15, fontWeight: "600" }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
