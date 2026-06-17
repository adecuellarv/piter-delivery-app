import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { ShoppingBag } from 'lucide-react-native';
import tw from '../../tw'

const MOCK_ORDERS = [
  {
    id: 101,
    restaurant: 'Pizza Bella',
    address: 'Av. Principal 456',
    pickupOrigin: 'Ignacio Peréz (El muerto)',
    distance: '1.2 km',
    time: '5 min',
    total: '$286',
    items: ['1 pizza pepperoni familiar', '1 refresco 2L', '1 orden de papas'],
    latitude: 20.5052,
    longitude: -100.1414,
  },
  {
    id: 102,
    restaurant: 'Tacos Don Pepe',
    address: 'Calle Hidalgo 210',
    pickupOrigin: 'El Chamizal',
    distance: '900 m',
    time: '4 min',
    total: '$148',
    items: ['4 tacos al pastor', '1 gringa', '2 aguas frescas'],
    latitude: 20.5018,
    longitude: -100.1482,
  },
  {
    id: 103,
    restaurant: 'Sushi Go',
    address: 'Blvd. Centro Sur 88',
    pickupOrigin: 'Cabecera municipal CENTRO',
    distance: '1.8 km',
    time: '7 min',
    total: '$322',
    items: ['2 rollos california', '1 yakimeshi', '1 té helado'],
    latitude: 20.4979,
    longitude: -100.1389,
  },
  {
    id: 104,
    restaurant: 'Burger House',
    address: 'Av. Tecnologico 541',
    pickupOrigin: 'Ignacio Peréz (El muerto)',
    distance: '2.1 km',
    time: '8 min',
    total: '$264',
    items: ['2 hamburguesas dobles', '1 aros de cebolla', '2 malteadas'],
    latitude: 20.5095,
    longitude: -100.1523,
  },
  {
    id: 105,
    restaurant: 'La Pasta Nostra',
    address: 'Calle Allende 19',
    pickupOrigin: 'El Chamizal',
    distance: '1.4 km',
    time: '6 min',
    total: '$358',
    items: ['1 fettuccine alfredo', '1 lasaña boloñesa', '2 panes de ajo'],
    latitude: 20.4957,
    longitude: -100.1466,
  },
  {
    id: 106,
    restaurant: 'Ensaladas Fresh',
    address: 'Plaza Jardines Local 6',
    pickupOrigin: 'Cabecera municipal CENTRO',
    distance: '750 m',
    time: '3 min',
    total: '$173',
    items: ['1 ensalada cesar', '1 wrap de pollo', '1 jugo verde'],
    latitude: 20.5036,
    longitude: -100.1365,
  },
  {
    id: 107,
    restaurant: 'Cafeteria Aurora',
    address: 'Av. Universidad 320',
    pickupOrigin: 'Ignacio Peréz (El muerto)',
    distance: '2.4 km',
    time: '9 min',
    total: '$129',
    items: ['2 lattes grandes', '2 croissants', '1 brownie'],
    latitude: 20.5112,
    longitude: -100.1441,
  },
  {
    id: 108,
    restaurant: 'Pollos El Carbon',
    address: 'Calzada del Parque 77',
    pickupOrigin: 'El Chamizal',
    distance: '1.6 km',
    time: '6 min',
    total: '$412',
    items: ['1 pollo rostizado', '1 arroz rojo', '1 orden de tortillas', '1 refresco 2L'],
    latitude: 20.4988,
    longitude: -100.1544,
  },
];

export default function DriverMapScreen() {
  const CARD_WIDTH = Dimensions.get('window').width - 64;
  const CARD_SPACING = 16;
  const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOrders, setPendingOrders] = useState(MOCK_ORDERS);
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const mapRef = useRef(null);

  // Ubicación del conductor (ejemplo)
  const [driverLocation] = useState({
    latitude: 20.502493611111,
    longitude: -100.14473027778,
  });
  const newOrder = pendingOrders[activeOrderIndex] ?? null;
  const nearbyOrders = pendingOrders;

  // Animación para el efecto de radar (pulso)
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
        latitude: newOrder.latitude,
        longitude: newOrder.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      350
    );
  }, [newOrder]);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    console.log('Estado del conductor:', !isOnline ? 'En servicio' : 'Fuera de servicio');
  };

  const advanceOrderQueue = () => {
    const nextOrders = pendingOrders.filter((_, index) => index !== activeOrderIndex);
    const nextIndex =
      nextOrders.length === 0 ? 0 : Math.min(activeOrderIndex, nextOrders.length - 1);

    setPendingOrders(nextOrders);
    setActiveOrderIndex(nextIndex);
    setExpandedOrderId(null);
  };

  const handleOrderScrollEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_SNAP_INTERVAL);
    const safeIndex = Math.max(0, Math.min(nextIndex, pendingOrders.length - 1));
    setActiveOrderIndex(safeIndex);
  };

  const handleCardPress = (orderId, index) => {
    setActiveOrderIndex(index);
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId));
  };

  const handleAcceptOrder = () => {
    if (!newOrder) return;

    Alert.alert('Pedido Aceptado', `Has aceptado el pedido de ${newOrder.restaurant}`);
    advanceOrderQueue();
  };

  const handleRejectOrder = () => {
    if (!newOrder) return;

    Alert.alert('Pedido Rechazado', 'Has rechazado el pedido');
    advanceOrderQueue();
  };

  return (
    <View style={tw`flex-1 bg-[#E8E3D8]`}>
      {/* Toggle Online/Offline */}
      <View style={tw`absolute top-16 left-5 z-10`}>
        <TouchableOpacity
          onPress={handleToggleOnline}
          activeOpacity={0.8}
          style={[
            tw.style(
              'w-[120px] h-[50px] rounded-[25px] flex-row items-center px-2',
              isOnline ? 'bg-[#C86F4F]' : 'bg-[#9E9E9E]'
            ),
            {
              // Sombras (iOS/Android)
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        >
          <Text style={tw`text-white text-base font-semibold ml-2`}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>

          {/* Knob */}
          <View
            style={tw.style(
              'w-[34px] h-[34px] rounded-full bg-white absolute',
              isOnline ? 'right-[8px]' : 'left-[8px]'
            )}
          />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
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
        {/* Círculos concéntricos (efecto radar) */}
        <Circle
          center={driverLocation}
          radius={500}
          strokeColor="rgba(200, 111, 79, 0.3)"
          fillColor="rgba(255, 200, 150, 0.1)"
          strokeWidth={2}
        />
        <Circle
          center={driverLocation}
          radius={1000}
          strokeColor="rgba(200, 111, 79, 0.2)"
          fillColor="rgba(255, 200, 150, 0.05)"
          strokeWidth={2}
        />
        <Circle
          center={driverLocation}
          radius={1500}
          strokeColor="rgba(200, 111, 79, 0.1)"
          fillColor="rgba(255, 200, 150, 0.02)"
          strokeWidth={2}
        />

        {/* Marcador del conductor con pulso */}
        <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View>
            <Animated.View
              style={[
                tw`absolute self-center w-12 h-12 rounded-full bg-[#FF9800]`,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <View
              style={[
                tw`w-6 h-6 rounded-full bg-[#FF9800] items-center justify-center border-2 border-white`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
            </View>
          </View>
        </Marker>

        {/* Marcadores de pedidos cercanos */}
        {nearbyOrders.map((order, index) => (
          <Marker
            key={order.id}
            coordinate={{ latitude: order.latitude, longitude: order.longitude }}
            zIndex={index === activeOrderIndex ? 10 : 1}
          >
            <View
              style={[
                tw.style(
                  'items-center justify-center border-2 border-white rounded-full',
                  index === activeOrderIndex ? 'w-7 h-7 bg-[#C86F4F]' : 'w-5 h-5 bg-[#3D3D3D]'
                ),
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
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

      {/* Carrusel de pedidos */}
      {pendingOrders.length > 0 && (
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
              <TouchableOpacity
                key={order.id}
                activeOpacity={0.95}
                onPress={() => handleCardPress(order.id, index)}
                style={[
                  tw`bg-white rounded-[24px] p-6 mr-4`,
                  { width: CARD_WIDTH },
                  index === pendingOrders.length - 1 ? { marginRight: 16 } : null,
                  {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: index === activeOrderIndex ? 0.18 : 0.1,
                    shadowRadius: 16,
                    elevation: index === activeOrderIndex ? 10 : 6,
                  },
                ]}
              >
                <Text style={tw`text-2xl font-bold text-[#3D3D3D] mb-2`}>
                  Nuevo Pedido
                </Text>

                <Text style={tw`text-sm text-[#757575] mb-4`}>
                  Pedido {index + 1} de {pendingOrders.length}
                </Text>

                <View style={tw`flex-row items-center mb-6`}>
                  <View style={tw`w-[60px] h-[60px] rounded-[16px] bg-[#FFF5F0] items-center justify-center mr-4`}>
                    <ShoppingBag size={32} color="#C86F4F" strokeWidth={2} />
                  </View>

                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xl font-bold text-[#3D3D3D] mb-2`}>
                      {order.restaurant}
                    </Text>
                    <Text style={tw`text-sm text-[#757575] mb-2`}>
                      {order.address}
                    </Text>
                    <Text style={tw`text-sm text-[#C86F4F] mb-2`}>
                      Origen: {order.pickupOrigin}
                    </Text>
                    <View style={tw`flex-row`}>
                      <Text style={tw`text-sm text-[#757575] mr-4`}>{order.distance}</Text>
                      <Text style={tw`text-sm text-[#757575]`}>{order.time}</Text>
                    </View>
                  </View>
                </View>

                {expandedOrderId === order.id && (
                  <View style={tw`mb-6 bg-[#F8F3EE] rounded-[18px] p-4`}>
                    <Text style={tw`text-sm font-semibold text-[#3D3D3D] mb-2`}>
                      Detalle del pedido
                    </Text>
                    <Text style={tw`text-sm text-[#6E6258] mb-1`}>
                      Total: {order.total}
                    </Text>
                    <Text style={tw`text-sm text-[#6E6258] mb-2`}>
                      Items:
                    </Text>
                    {order.items.map((item) => (
                      <Text key={item} style={tw`text-sm text-[#6E6258] mb-1`}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={tw`flex-row`}>
                  <TouchableOpacity
                    style={[
                      tw`flex-1 bg-[#C86F4F] py-4 rounded-[16px] items-center mr-3`,
                      {
                        shadowColor: '#C86F4F',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                      },
                    ]}
                    onPress={handleAcceptOrder}
                    activeOpacity={0.8}
                  >
                    <Text style={tw`text-white text-base font-bold tracking-[0.5px]`}>
                      ACEPTAR
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      tw`flex-1 bg-[#3D3D3D] py-4 rounded-[16px] items-center ml-3`,
                      {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 5,
                      },
                    ]}
                    onPress={handleRejectOrder}
                    activeOpacity={0.8}
                  >
                    <Text style={tw`text-white text-base font-bold tracking-[0.5px]`}>
                      RECHAZAR
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
    </View>
  );
}
