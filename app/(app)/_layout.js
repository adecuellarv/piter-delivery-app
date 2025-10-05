// app/_layout.js
import { Stack, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Menu } from "lucide-react-native";

export default function RootLayout() {
  const router = useRouter();

  // 🔹 Componente de Header personalizado
  const CustomHeader = ({ title }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#000",
        opacity: 0.8
      }}
    >
      {/* Flecha de regresar */}
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
        {title}
      </Text>

      {/* Menú hamburguesa */}
      <TouchableOpacity onPress={() => alert("Abrir menú lateral")}>
        <Menu color="white" size={24} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // sin header en login o home principal
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          header: () => <CustomHeader title="Inicio" />,
        }}
      />

      <Stack.Screen
        name="(app)/perfil"
        options={{
          header: () => <CustomHeader title="Mi Perfil" />,
        }}
      />
    </Stack>
  );
}
