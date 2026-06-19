import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MapPin, Trash2, Plus, Minus } from "lucide-react-native";

const BG = "#EAE4D9";
const ACCENT = "#C86F4F";
const DARK = "#1C1C1C";

const MOCK_ZONES = [
  { id: 1, name: "Ignacio Pérez", orders: 8, tarifa: 45, minTarifa: 35 },
  { id: 2, name: "San Clemente", orders: 3, tarifa: 60, minTarifa: 45 },
];

function ZoneCard({ zone, onDelete, onChangeTarifa }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        marginBottom: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Fila superior */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: "#FDF0EB",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MapPin size={22} color={ACCENT} strokeWidth={1.8} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#1A1815" }}>{zone.name}</Text>
          <Text style={{ fontSize: 13, color: "#9A9490", marginTop: 2 }}>
            {zone.orders} pedidos disponibles
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(zone.id)}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: "#F5F0EB",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trash2 size={17} color="#B0A89E" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#F0EBE3", marginHorizontal: 16 }} />

      {/* Stepper de tarifa */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#3D3933" }}>
            Tarifa de entrega
          </Text>
          <Text style={{ fontSize: 12, color: "#9A9490", marginTop: 2 }}>
            Mín. negociable ${zone.minTarifa}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onChangeTarifa(zone.id, -5)}
            activeOpacity={0.8}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: DARK,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Minus size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1A1815", minWidth: 52, textAlign: "center" }}>
            ${zone.tarifa}
          </Text>

          <TouchableOpacity
            onPress={() => onChangeTarifa(zone.id, 5)}
            activeOpacity={0.8}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: ACCENT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ZonasScreen() {
  const [zones, setZones] = useState(MOCK_ZONES);

  const handleDelete = (id) => {
    Alert.alert("Eliminar zona", "¿Quieres eliminar esta zona?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => setZones((prev) => prev.filter((z) => z.id !== id)),
      },
    ]);
  };

  const handleChangeTarifa = (id, delta) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== id) return z;
        const next = z.tarifa + delta;
        return next >= z.minTarifa ? { ...z, tarifa: next } : z;
      })
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>


      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 13, color: "#9A9490", marginBottom: 14, fontWeight: "500" }}>
          {zones.length} zona{zones.length !== 1 ? "s" : ""} activa{zones.length !== 1 ? "s" : ""}
        </Text>

        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onDelete={handleDelete}
            onChangeTarifa={handleChangeTarifa}
          />
        ))}

        {/* Agregar zona */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            marginTop: 8,
            borderWidth: 1.5,
            borderColor: ACCENT,
            borderStyle: "dashed",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            backgroundColor: "#FFF8F5",
          }}
        >
          <Text style={{ color: ACCENT, fontSize: 15, fontWeight: "600" }}>+ Agregar zona</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
