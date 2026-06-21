import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { MapPin, Trash2, Plus, Minus, X, Search } from "lucide-react-native";
import { getZones, getRepartidorZones, updateRepartidorZones } from "../../api/zones";
import { useAuthStore } from "../../store/authStore";
import { useZonesStore } from "../../store/zonesStore";

const BG = "#EAE4D9";
const ACCENT = "#C86F4F";
const DARK = "#1C1C1C";

const getRepartidorId = (user) =>
  user?.id ??
  user?.ID ??
  user?.repartidorId ??
  user?.repartidor_id ??
  user?.wpId ??
  user?.wp_id ??
  user?.postId ??
  user?.post_id ??
  user?.loginData?.result?.usuario?.id ??
  user?.loginData?.result?.usuario?.ID ??
  user?.loginData?.result?.usuario?.wpId ??
  user?.loginData?.result?.usuario?.wp_id ??
  user?.loginData?.result?.usuario?.postId ??
  user?.loginData?.result?.usuario?.post_id;

function ZoneCard({ zone, onDelete, onChangeTarifa, disabled }) {
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
          disabled={disabled}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: "#F5F0EB",
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
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
            disabled={disabled}
            activeOpacity={0.8}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: DARK,
              alignItems: "center",
              justifyContent: "center",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <Minus size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1A1815", minWidth: 52, textAlign: "center" }}>
            ${zone.tarifa}
          </Text>

          <TouchableOpacity
            onPress={() => onChangeTarifa(zone.id, 5)}
            disabled={disabled}
            activeOpacity={0.8}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: ACCENT,
              alignItems: "center",
              justifyContent: "center",
              opacity: disabled ? 0.5 : 1,
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
  const user = useAuthStore((s) => s.user);
  const repartidorId = getRepartidorId(user);
  const setStoreZones = useZonesStore((s) => s.setZones);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal agregar zona
  const [modalVisible, setModalVisible] = useState(false);
  const [availableZones, setAvailableZones] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [search, setSearch] = useState("");

  const loadZones = useCallback(async ({ refresh = false } = {}) => {
    if (!repartidorId) {
      setZones([]);
      setError("No se encontró el repartidor de la sesión.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getRepartidorZones(repartidorId);
      setZones(data);
      setStoreZones(data);
    } catch (err) {
      setError("No se pudieron cargar tus zonas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [repartidorId]);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  const persistZones = async (nextZones, previousZones) => {
    setSaving(true);
    setError("");
    setStoreZones(nextZones);

    try {
      await updateRepartidorZones(repartidorId, nextZones, user?.token);
    } catch (err) {
      setZones(previousZones);
      setStoreZones(previousZones);
      Alert.alert("Error", err?.message || "No se pudieron guardar los cambios de zonas.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar zona", "¿Quieres eliminar esta zona?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const previousZones = zones;
          const nextZones = zones.filter((z) => z.id !== id);

          setZones(nextZones);
          await persistZones(nextZones, previousZones);
        },
      },
    ]);
  };

  const handleChangeTarifa = async (id, delta) => {
    const previousZones = zones;
    let changed = false;

    const nextZones = zones.map((z) => {
        if (z.id !== id) return z;
        const next = z.tarifa + delta;
        if (next < z.minTarifa) return z;
        changed = true;
        return { ...z, tarifa: next };
      });

    if (!changed) {
      return;
    }

    setZones(nextZones);
    await persistZones(nextZones, previousZones);
  };

  const handleOpenModal = async () => {
    setSearch("");
    setModalVisible(true);
    setLoadingAvailable(true);
    try {
      const data = await getZones();
      setAvailableZones(data ?? []);
    } catch {
      Alert.alert("Error", "No se pudieron cargar las zonas disponibles.");
      setModalVisible(false);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleAddZone = async (item) => {
    const alreadyAdded = zones.some((z) => z.id === item.id);
    if (alreadyAdded) {
      Alert.alert("Zona duplicada", "Ya tienes esta zona agregada.");
      return;
    }
    const newZone = {
      id: item.id,
      name: item.title?.rendered ?? item.name ?? "Zona",
      orders: 0,
      tarifa: 0,
      minTarifa: 0,
    };
    const previousZones = zones;
    const nextZones = [...zones, newZone];
    setZones(nextZones);
    setModalVisible(false);
    await persistZones(nextZones, previousZones);
  };

  const filteredAvailable = availableZones.filter((z) => {
    const name = z.title?.rendered ?? z.name ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>


      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadZones({ refresh: true })}
            tintColor={ACCENT}
          />
        }
      >
        <Text style={{ fontSize: 13, color: "#9A9490", marginBottom: 14, fontWeight: "500" }}>
          {zones.length} zona{zones.length !== 1 ? "s" : ""} activa{zones.length !== 1 ? "s" : ""}
          {saving ? " - Guardando..." : ""}
        </Text>

        {loading ? (
          <View style={{ alignItems: "center", paddingVertical: 30 }}>
            <ActivityIndicator color={ACCENT} />
            <Text style={{ fontSize: 13, color: "#9A9490", marginTop: 10 }}>
              Cargando zonas...
            </Text>
          </View>
        ) : error ? (
          <View style={{ backgroundColor: "#FFF8F5", borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: ACCENT, fontSize: 14, fontWeight: "600", marginBottom: 10 }}>
              {error}
            </Text>
            <TouchableOpacity onPress={() => loadZones()} activeOpacity={0.75}>
              <Text style={{ color: DARK, fontSize: 14, fontWeight: "700" }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : zones.length === 0 ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#3D3933", fontSize: 14, fontWeight: "600" }}>
              No tienes zonas asignadas.
            </Text>
          </View>
        ) : zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onDelete={handleDelete}
            onChangeTarifa={handleChangeTarifa}
            disabled={saving}
          />
        ))}

        {/* Agregar zona */}
        <TouchableOpacity
          onPress={handleOpenModal}
          activeOpacity={0.7}
          disabled={saving}
          style={{
            marginTop: 8,
            borderWidth: 1.5,
            borderColor: ACCENT,
            borderStyle: "dashed",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            backgroundColor: "#FFF8F5",
            opacity: saving ? 0.5 : 1,
          }}
        >
          <Text style={{ color: ACCENT, fontSize: 15, fontWeight: "600" }}>+ Agregar zona</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal agregar zona */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: BG,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "75%",
            overflow: "hidden",
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#C8C0B4" }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 14,
          }}>
            <Text style={{ flex: 1, fontSize: 17, fontWeight: "700", color: "#1A1815" }}>
              Agregar zona
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#E8E0D6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} color="#6B6560" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            marginBottom: 12,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#E0D8D0",
          }}>
            <Search size={16} color="#9A9490" strokeWidth={1.8} style={{ marginRight: 8 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar zona..."
              placeholderTextColor="#B0A89E"
              style={{ flex: 1, height: 44, fontSize: 14, color: "#1A1815" }}
              autoCorrect={false}
            />
          </View>

          {/* Lista */}
          {loadingAvailable ? (
            <View style={{ alignItems: "center", paddingVertical: 30 }}>
              <ActivityIndicator color={ACCENT} />
            </View>
          ) : (
            <FlatList
              data={filteredAvailable}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
              ListEmptyComponent={
                <Text style={{ color: "#9A9490", fontSize: 14, textAlign: "center", paddingVertical: 20 }}>
                  No se encontraron zonas
                </Text>
              }
              renderItem={({ item, index }) => {
                const name = item.title?.rendered ?? item.name ?? "Zona";
                const alreadyAdded = zones.some((z) => z.id === item.id);
                const isLast = index === filteredAvailable.length - 1;
                return (
                  <TouchableOpacity
                    onPress={() => !alreadyAdded && handleAddZone(item)}
                    activeOpacity={alreadyAdded ? 1 : 0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      backgroundColor: "#fff",
                      borderRadius: index === 0 ? 0 : 0,
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: "#F0EBE3",
                      borderRadius: 0,
                      opacity: alreadyAdded ? 0.45 : 1,
                      ...(index === 0 ? { borderTopLeftRadius: 14, borderTopRightRadius: 14 } : {}),
                      ...(isLast ? { borderBottomLeftRadius: 14, borderBottomRightRadius: 14 } : {}),
                    }}
                  >
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "#FDF0EB",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}>
                      <MapPin size={18} color={ACCENT} strokeWidth={1.8} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: "#1A1815" }}>
                      {name}
                    </Text>
                    {alreadyAdded && (
                      <Text style={{ fontSize: 12, color: "#9A9490" }}>Agregada</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
