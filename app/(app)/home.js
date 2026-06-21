import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { ShoppingBag, ChevronLeft, MapPin } from 'lucide-react-native';
import tw from '../../tw';
import { useAuthStore } from '../../store/authStore';
import { useZonesStore } from '../../store/zonesStore';
import { getOrdersByZones } from '../../api/orders';
import { getLocalById, getStoreStatus } from '../../api/negocios';
import { calcRouteDistances, extractClientCoords } from '../../functions/distance';
import { getTarifaForZone } from '../../functions/zones';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_SPACING = 16;
const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const MOCK_CLIENT = {
  name: 'María L.',
  address: 'Av. Principal 456 · Los Girasoles',
  score: 'Bueno',
};
const SCORE_LEVELS = ['Bajo', 'Medio', 'Bueno', 'Excelente'];
const SCORE_COLORS = ['#E53935', '#FFA726', '#8BC34A', '#43A047'];

function OrderCard({ order, index, total, isActive, driverLocation, zones, onPress, onAccept, onReject }) {
  const storeLat = order.location?.lat ?? driverLocation.latitude + 0.005;
  const storeLng = order.location?.lng ?? driverLocation.longitude + 0.005;
  const clientCoords = extractClientCoords(order);
  const clientLat = clientCoords?.lat ?? storeLat + 0.015;
  const clientLng = clientCoords?.lng ?? storeLng + 0.008;

  const zoneId = order.location?.zoneId ?? order.zoneId ?? order.zonaId;
  const tarifa = getTarifaForZone(zones, zoneId, order.location?.zoneName);

  const distances = calcRouteDistances(
    driverLocation.latitude,
    driverLocation.longitude,
    storeLat,
    storeLng,
    clientLat,
    clientLng
  );

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[
        tw`bg-white rounded-[24px] p-5 mr-4`,
        { width: CARD_WIDTH },
        index === total - 1 ? { marginRight: 16 } : null,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isActive ? 0.18 : 0.1,
          shadowRadius: 16,
          elevation: isActive ? 10 : 6,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#3D3D3D' }}>Nuevo pedido</Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            Pedido {index + 1} de {total} ·{' '}
            {order.payment?.method === 'cash' ? 'Efectivo' : (order.payment?.method ?? 'Efectivo')}
          </Text>
        </View>
        <View style={{ backgroundColor: '#FDECEA', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontSize: 11, color: '#C86F4F', fontWeight: '600' }}>
            {order.type === 'pickup' ? 'Recoger' : 'A domicilio'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF5F0', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <ShoppingBag size={22} color="#C86F4F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#3D3D3D' }}>
            {order.localSnapshot?.name ?? 'Local'}
          </Text>
          <Text style={{ fontSize: 12, color: '#888' }}>{order.location?.zoneName ?? ''}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#3D3D3D' }}>
            ${order.totals?.total}
          </Text>
          {tarifa != null && (
            <Text style={{ fontSize: 12, color: '#C86F4F', fontWeight: '600' }}>
              +${tarifa} entrega
            </Text>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        <View style={{ flex: 1, backgroundColor: '#F8F3EE', borderRadius: 12, padding: 10 }}>
          <Text style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>Tú → Local</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#3D3D3D' }}>
            {distances.driverToLocal.km} km · {distances.driverToLocal.min} min
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#F8F3EE', borderRadius: 12, padding: 10 }}>
          <Text style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>Local → Cliente</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#3D3D3D' }}>
            {distances.localToClient.km} km · {distances.localToClient.min} min
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#C86F4F', borderRadius: 14, paddingVertical: 13, alignItems: 'center' }}
          onPress={onAccept}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#3D3D3D', borderRadius: 14, paddingVertical: 13, alignItems: 'center' }}
          onPress={onReject}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ScoreBar({ score }) {
  const activeIndex = SCORE_LEVELS.indexOf(score);
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
        {SCORE_LEVELS.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= activeIndex ? SCORE_COLORS[i] : '#E0E0E0',
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {SCORE_LEVELS.map((l, i) => (
          <Text
            key={i}
            style={{
              fontSize: 10,
              color: i === activeIndex ? '#3D3D3D' : '#BDBDBD',
              fontWeight: i === activeIndex ? '600' : '400',
            }}
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

function OrderDetailSheet({ order, index, total, onClose, onAccept, onReject, driverLocation, zones }) {
  const [mapTab, setMapTab] = useState('recoger');
  const [localData, setLocalData] = useState(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const mapRef = useRef(null);

  const localId = order.localId ?? order.local_id ?? order.localSnapshot?.id;

  useEffect(() => {
    if (!localId) return;
    getLocalById(localId)
      .then(setLocalData)
      .catch((err) => console.warn('Error cargando local:', err));
  }, [localId]);

  const storeName = localData?.name ?? order.localSnapshot?.name ?? 'Local';
  const storeZone = localData?.acf?.zona?.post_title ?? order.location?.zoneName ?? '';
  const storeStatus = localData ? getStoreStatus(localData.acf?.horarios) : '';
  const storeLat = localData?.acf?.latitud
    ? parseFloat(localData.acf.latitud)
    : (order.location?.lat ?? driverLocation.latitude + 0.005);
  const storeLng = localData?.acf?.longitud
    ? parseFloat(localData.acf.longitud)
    : (order.location?.lng ?? driverLocation.longitude + 0.005);

  const clientCoords = extractClientCoords(order);
  const clientLat = clientCoords?.lat ?? storeLat + 0.015;
  const clientLng = clientCoords?.lng ?? storeLng + 0.008;

  const distances = calcRouteDistances(
    driverLocation.latitude,
    driverLocation.longitude,
    storeLat,
    storeLng,
    clientLat,
    clientLng
  );
  const DRIVER_TO_LOCAL = distances.driverToLocal;
  const LOCAL_TO_CLIENT = distances.localToClient;
  const TOTAL_DISTANCE = distances.total;

  const zoneId = localData?.acf?.zona?.ID ?? order.location?.zoneId ?? order.zoneId;
  const zoneName = localData?.acf?.zona?.post_title ?? order.location?.zoneName;
  const tarifa = getTarifaForZone(zones, zoneId, zoneName);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      damping: 25,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(onClose);
  };

  const getMapRegion = useCallback(() => {
    if (mapTab === 'recoger') {
      return {
        latitude: (driverLocation.latitude + storeLat) / 2,
        longitude: (driverLocation.longitude + storeLng) / 2,
        latitudeDelta: Math.abs(driverLocation.latitude - storeLat) * 3 + 0.01,
        longitudeDelta: Math.abs(driverLocation.longitude - storeLng) * 3 + 0.01,
      };
    }
    if (mapTab === 'entregar') {
      return {
        latitude: (storeLat + clientLat) / 2,
        longitude: (storeLng + clientLng) / 2,
        latitudeDelta: Math.abs(storeLat - clientLat) * 3 + 0.01,
        longitudeDelta: Math.abs(storeLng - clientLng) * 3 + 0.01,
      };
    }
    const minLat = Math.min(driverLocation.latitude, storeLat, clientLat);
    const maxLat = Math.max(driverLocation.latitude, storeLat, clientLat);
    const minLng = Math.min(driverLocation.longitude, storeLng, clientLng);
    const maxLng = Math.max(driverLocation.longitude, storeLng, clientLng);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 2 + 0.015,
      longitudeDelta: (maxLng - minLng) * 2 + 0.015,
    };
  }, [mapTab, driverLocation, storeLat, storeLng, clientLat, clientLng]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(getMapRegion(), 400);
    }
  }, [mapTab]);

  const paymentLabel =
    order.payment?.method === 'cash'
      ? 'Efectivo'
      : (order.payment?.method ?? 'Efectivo');

  const tabLabels = { recoger: 'A recoger', entregar: 'A entregar', todo: 'Todo' };
  const bubbleTitle =
    mapTab === 'recoger' ? 'TÚ → LOCAL' : mapTab === 'entregar' ? 'LOCAL → CLIENTE' : 'RECORRIDO COMPLETO';
  const bubbleValue =
    mapTab === 'recoger'
      ? `${DRIVER_TO_LOCAL.km} km · ${DRIVER_TO_LOCAL.min} min`
      : mapTab === 'entregar'
      ? `${LOCAL_TO_CLIENT.km} km · ${LOCAL_TO_CLIENT.min} min`
      : `${TOTAL_DISTANCE.km} km · ${TOTAL_DISTANCE.min} min`;

  return (
    <Modal transparent animationType="none" visible statusBarTranslucent>
      <Animated.View
        style={{ flex: 1, transform: [{ translateY: slideAnim }], backgroundColor: '#F5F0EB' }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            <TouchableOpacity onPress={handleClose} style={{ marginRight: 10, marginTop: 4 }}>
              <ChevronLeft size={24} color="#3D3D3D" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#3D3D3D' }}>Nuevo pedido</Text>
              <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                Pedido {index + 1} de {total} · {paymentLabel}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#FDECEA',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: '#C86F4F', fontSize: 12, fontWeight: '600' }}>
                Entrega a domicilio
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Map */}
            <View
              style={{
                marginHorizontal: 12,
                marginBottom: 10,
                borderRadius: 20,
                overflow: 'hidden',
                height: 220,
              }}
            >
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={getMapRegion()}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
              >
                {(mapTab === 'recoger' || mapTab === 'todo') && (
                  <Polyline
                    coordinates={[
                      { latitude: driverLocation.latitude, longitude: driverLocation.longitude },
                      { latitude: storeLat, longitude: storeLng },
                    ]}
                    strokeColor="#4A90D9"
                    strokeWidth={3}
                  />
                )}
                {(mapTab === 'entregar' || mapTab === 'todo') && (
                  <Polyline
                    coordinates={[
                      { latitude: storeLat, longitude: storeLng },
                      { latitude: clientLat, longitude: clientLng },
                    ]}
                    strokeColor="#C86F4F"
                    strokeWidth={3}
                  />
                )}
                <Marker coordinate={{ latitude: storeLat, longitude: storeLng }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#C86F4F',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  >
                    <ShoppingBag size={14} color="#fff" />
                  </View>
                </Marker>
                {(mapTab === 'entregar' || mapTab === 'todo') && (
                  <Marker coordinate={{ latitude: clientLat, longitude: clientLng }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#2D2D2D',
                        borderWidth: 2,
                        borderColor: '#fff',
                      }}
                    />
                  </Marker>
                )}
                {mapTab !== 'entregar' && (
                  <Marker
                    coordinate={{
                      latitude: driverLocation.latitude,
                      longitude: driverLocation.longitude,
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#2D2D2D',
                        borderWidth: 2,
                        borderColor: '#fff',
                      }}
                    />
                  </Marker>
                )}
              </MapView>

              {/* Tabs overlay */}
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  right: 12,
                  zIndex: 10,
                  backgroundColor: '#fff',
                  borderRadius: 24,
                  flexDirection: 'row',
                  padding: 3,
                }}
              >
                {['recoger', 'entregar', 'todo'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setMapTab(tab)}
                    style={{
                      flex: 1,
                      paddingVertical: 7,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: mapTab === tab ? '#2D2D2D' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: mapTab === tab ? '#fff' : '#888',
                      }}
                    >
                      {tabLabels[tab]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Distance bubble */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    color: '#888',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {bubbleTitle}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#2D2D2D', marginTop: 2 }}>
                  {bubbleValue}
                </Text>
              </View>
            </View>

            {/* Recorrido total */}
            <View
              style={{
                backgroundColor: '#2D2D2D',
                marginHorizontal: 12,
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 14,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: '#888',
                  fontWeight: '700',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Recorrido total
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>
                  {TOTAL_DISTANCE.km} km
                </Text>
                <Text style={{ fontSize: 16, color: '#C86F4F', marginLeft: 10, fontWeight: '600' }}>
                  · {TOTAL_DISTANCE.min} min
                </Text>
              </View>
            </View>

            {/* Cliente */}
            <View
              style={{
                backgroundColor: '#fff',
                marginHorizontal: 12,
                borderRadius: 20,
                padding: 16,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#888',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Cliente
                </Text>
                <View
                  style={{
                    backgroundColor: '#F0F9EE',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#4CAF50', fontWeight: '600' }}>
                    Score: {MOCK_CLIENT.score}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: '#E0E0E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#757575' }}>M</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#2D2D2D' }}>
                    {MOCK_CLIENT.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>{MOCK_CLIENT.address}</Text>
                </View>
              </View>
              <ScoreBar score={MOCK_CLIENT.score} />
            </View>

            {/* Recoger en */}
            <View
              style={{
                backgroundColor: '#fff',
                marginHorizontal: 12,
                borderRadius: 20,
                padding: 16,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#888',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Recoger en
                </Text>
                {storeStatus && (
                  <View
                    style={{
                      backgroundColor: storeStatus.startsWith('Abierto') ? '#F0F9EE' : '#FFF0F0',
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: storeStatus.startsWith('Abierto') ? '#4CAF50' : '#E53935',
                        fontWeight: '600',
                      }}
                    >
                      {storeStatus}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#FFF5F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <ShoppingBag size={18} color="#C86F4F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#2D2D2D' }}>
                    {storeName}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>{storeZone}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <MapPin size={13} color="#C86F4F" />
                <Text style={{ fontSize: 11, color: '#888', marginHorizontal: 4 }}>
                  {storeLat.toFixed(4)}, {storeLng.toFixed(4)}
                </Text>
                <Text style={{ fontSize: 11, color: '#C86F4F', fontWeight: '600' }}>
                  Abrir en Maps
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8F3EE',
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#4A90D9',
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>
                      Tú → Local
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#2D2D2D' }}>
                    {DRIVER_TO_LOCAL.km} km
                  </Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>≈ {DRIVER_TO_LOCAL.min} min</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F8F3EE',
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#C86F4F',
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>
                      Local → Cliente
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#2D2D2D' }}>
                    {LOCAL_TO_CLIENT.km} km
                  </Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>≈ {LOCAL_TO_CLIENT.min} min</Text>
                </View>
              </View>
            </View>

            {/* Detalle del pedido */}
            <View
              style={{
                backgroundColor: '#fff',
                marginHorizontal: 12,
                borderRadius: 20,
                padding: 16,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: '#888',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Detalle del pedido
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: '#888' }}>Subtotal</Text>
                <Text style={{ fontSize: 14, color: '#888' }}>
                  ${order.totals?.subtotal ?? order.totals?.total}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                  borderTopWidth: 1,
                  borderTopColor: '#F0EDE8',
                  paddingTop: 8,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2D2D2D' }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2D2D2D' }}>
                  ${order.totals?.total} {order.totals?.currency ?? 'MXN'}
                </Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 8 }}>
                Productos
              </Text>
              {(order.items ?? []).map((item, i) => (
                <View
                  key={i}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}
                >
                  <Text style={{ fontSize: 13, color: '#555', flex: 1, marginRight: 8 }}>
                    {item.quantity}× {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#555' }}>${item.totalPrice}</Text>
                </View>
              ))}

              {/* Tarifa de entrega */}
              <View
                style={{
                  backgroundColor: '#2D2D2D',
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 14,
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
                    Tu tarifa de entrega
                  </Text>
                  <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                    {zoneName ? `Zona ${zoneName} · negociable` : 'negociable'}
                  </Text>
                </View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>
                  {tarifa != null ? `$${tarifa}` : '—'}
                </Text>
              </View>
            </View>

            <View style={{ height: 110 }} />
          </ScrollView>

          {/* Buttons pinned at bottom */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              flexDirection: 'row',
              padding: 16,
              gap: 12,
              backgroundColor: '#F5F0EB',
            }}
          >
            <TouchableOpacity
              onPress={onAccept}
              style={{
                flex: 1,
                backgroundColor: '#C86F4F',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReject}
              style={{
                flex: 1,
                backgroundColor: '#2D2D2D',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

export default function DriverMapScreen() {
  const authLoading = useAuthStore((s) => s.authLoading);
  const storedZones = useZonesStore((s) => s.zones);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const mapRef = useRef(null);

  const [driverLocation] = useState({
    latitude: 20.502493611111,
    longitude: -100.14473027778,
  });

  const newOrder = pendingOrders[activeOrderIndex] ?? null;

  const loadOrders = useCallback(async () => {
    if (authLoading || !isOnline) {
      if (!isOnline) setPendingOrders([]);
      return;
    }
    setLoadingOrders(true);
    try {
      const zonaIds = storedZones
        .map((z) => z.id ?? z.ID ?? z.zona?.ID ?? z.zona?.id)
        .filter(Boolean);
      if (zonaIds.length === 0) {
        setPendingOrders([]);
        return;
      }
      const orders = await getOrdersByZones({ zonaIds, limit: 20 });
      setPendingOrders(orders);
      setActiveOrderIndex(0);
    } catch (err) {
      console.error('Error cargando órdenes:', err);
      Alert.alert('Error', 'No se pudieron cargar los pedidos disponibles.');
    } finally {
      setLoadingOrders(false);
    }
  }, [authLoading, isOnline, storedZones]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const pulseAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  useEffect(() => {
    if (!newOrder || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: newOrder?.location?.lat,
        longitude: newOrder?.location?.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      350
    );
  }, [newOrder]);

  const advanceOrderQueue = () => {
    const nextOrders = pendingOrders.filter((_, i) => i !== activeOrderIndex);
    setPendingOrders(nextOrders);
    setActiveOrderIndex(Math.min(activeOrderIndex, Math.max(0, nextOrders.length - 1)));
    setSelectedOrder(null);
  };

  const handleOrderScrollEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_SNAP_INTERVAL);
    setActiveOrderIndex(Math.max(0, Math.min(nextIndex, pendingOrders.length - 1)));
  };

  const handleAcceptOrder = () => {
    if (!newOrder) return;
    Alert.alert('Pedido Aceptado', `Has aceptado el pedido de ${newOrder.localSnapshot?.name}`);
    advanceOrderQueue();
  };

  const handleRejectOrder = () => {
    if (!newOrder) return;
    Alert.alert('Pedido Rechazado', 'Has rechazado el pedido');
    advanceOrderQueue();
  };

  return (
    <View style={tw`flex-1 bg-[#E8E3D8]`}>
      {/* Online toggle */}
      <View style={tw`absolute top-16 left-5 z-10`}>
        <TouchableOpacity
          onPress={() => setIsOnline((v) => !v)}
          activeOpacity={0.8}
          style={[
            tw.style(
              'w-[120px] h-[50px] rounded-[25px] flex-row items-center px-2',
              isOnline ? 'bg-[#C86F4F]' : 'bg-[#9E9E9E]'
            ),
            { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
          ]}
        >
          <Text style={tw`text-white text-base font-semibold ml-2`}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <View
            style={tw.style(
              'w-[34px] h-[34px] rounded-full bg-white absolute',
              isOnline ? 'right-[8px]' : 'left-[8px]'
            )}
          />
        </TouchableOpacity>
      </View>

      {/* Background map */}
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        <Circle center={driverLocation} radius={500} strokeColor="rgba(200,111,79,0.3)" fillColor="rgba(255,200,150,0.1)" strokeWidth={2} />
        <Circle center={driverLocation} radius={1000} strokeColor="rgba(200,111,79,0.2)" fillColor="rgba(255,200,150,0.05)" strokeWidth={2} />
        <Circle center={driverLocation} radius={1500} strokeColor="rgba(200,111,79,0.1)" fillColor="rgba(255,200,150,0.02)" strokeWidth={2} />

        <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View>
            <Animated.View
              style={[
                tw`absolute self-center w-12 h-12 rounded-full bg-[#FF9800]`,
                { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
              ]}
            />
            <View
              style={[
                tw`w-6 h-6 rounded-full bg-[#FF9800] items-center justify-center border-2 border-white`,
                { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
              ]}
            >
              <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
            </View>
          </View>
        </Marker>

        {pendingOrders.map((order, index) => (
          <Marker
            key={order.id}
            coordinate={{ latitude: order.location?.lat, longitude: order.location?.lng }}
            zIndex={index === activeOrderIndex ? 10 : 1}
          >
            <View
              style={[
                tw.style(
                  'items-center justify-center border-2 border-white rounded-full',
                  index === activeOrderIndex ? 'w-7 h-7 bg-[#C86F4F]' : 'w-5 h-5 bg-[#3D3D3D]'
                ),
                { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
              ]}
            >
              <View
                style={tw.style(
                  'rounded-full bg-white',
                  index === activeOrderIndex ? 'w-2.5 h-2.5' : 'w-2 h-2'
                )}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Loading */}
      {loadingOrders && (
        <View style={tw`absolute left-0 right-0 bottom-10 items-center`}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ActivityIndicator color="#C86F4F" size="small" />
            <Text style={{ fontSize: 14, color: '#3D3D3D', fontWeight: '500' }}>Buscando pedidos...</Text>
          </View>
        </View>
      )}

      {/* Order cards carousel */}
      {!loadingOrders && pendingOrders.length > 0 && (
        <View style={tw`absolute left-0 right-0 bottom-10`}>
          <Text style={tw`text-sm text-[#3D3D3D] font-semibold px-8 mb-3`}>
            {pendingOrders.length} pedidos disponibles en tu zona
          </Text>
          <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_SNAP_INTERVAL}
            snapToAlignment="start"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            onMomentumScrollEnd={handleOrderScrollEnd}
          >
            {pendingOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                total={pendingOrders.length}
                isActive={index === activeOrderIndex}
                driverLocation={driverLocation}
                onPress={() => {
                  setActiveOrderIndex(index);
                  setSelectedOrder({ order, index });
                }}
                zones={storedZones}
                onAccept={handleAcceptOrder}
                onReject={handleRejectOrder}
              />
            ))}
          </ScrollView>

          <View style={tw`flex-row justify-center mt-4`}>
            {pendingOrders.map((order, index) => (
              <View
                key={order.id}
                style={tw.style(
                  'rounded-full mx-1',
                  index === activeOrderIndex ? 'w-6 h-2 bg-[#C86F4F]' : 'w-2 h-2 bg-[#B8AEA4]'
                )}
              />
            ))}
          </View>
        </View>
      )}

      {/* Order detail bottom sheet */}
      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder.order}
          index={selectedOrder.index}
          total={pendingOrders.length}
          driverLocation={driverLocation}
          zones={storedZones}
          onClose={() => setSelectedOrder(null)}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
        />
      )}
    </View>
  );
}
