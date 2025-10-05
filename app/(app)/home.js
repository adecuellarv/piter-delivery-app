import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { ShoppingBag } from 'lucide-react-native';
import tw from '../../tw'

export default function DriverMapScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [newOrder, setNewOrder] = useState({
    id: 101,
    restaurant: 'Pizza Bella',
    address: 'Av. Principal 456',
    distance: '1.2 km',
    time: '5 min',
    latitude: 20.502493611111,
    longitude: -74.1718,
  });

  // Ubicación del conductor (ejemplo)
  const [driverLocation, setDriverLocation] = useState({
    latitude: 20.502493611111,
    longitude: -100.14473027778,
  });

  // Pedidos cercanos (ejemplo)
  const nearbyOrders = [
    { id: 1, latitude: 40.9176, longitude: -74.1718 },
    { id: 2, latitude: 40.9200, longitude: -74.1650 },
    { id: 3, latitude: 40.9120, longitude: -74.1750 },
    { id: 4, latitude: 40.9180, longitude: -74.1680 },
    { id: 5, latitude: 40.9140, longitude: -74.1720 },
  ];

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

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    console.log('Estado del conductor:', !isOnline ? 'Online' : 'Offline');
  };

  const handleAcceptOrder = async () => {
    try {
      const response = await fetch('https://tu-api.com/api/orders/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: newOrder.id, driverLocation }),
      });
      if (response.ok) {
        Alert.alert('Pedido Aceptado', `Has aceptado el pedido de ${newOrder.restaurant}`);
        setNewOrder(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo aceptar el pedido');
      console.error(error);
    }
  };

  const handleRejectOrder = async () => {
    try {
      const response = await fetch('https://tu-api.com/api/orders/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: newOrder.id }),
      });
      if (response.ok) {
        Alert.alert('Pedido Rechazado', 'Has rechazado el pedido');
        setNewOrder(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo rechazar el pedido');
      console.error(error);
    }
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
        {nearbyOrders.map((order) => (
          <Marker
            key={order.id}
            coordinate={{ latitude: order.latitude, longitude: order.longitude }}
          >
            <View
              style={[
                tw`w-5 h-5 rounded-full bg-[#3D3D3D] items-center justify-center border-2 border-white`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <View style={tw`w-2 h-2 rounded-full bg-white`} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Card de Nuevo Pedido */}
      {newOrder && (
        <View
          style={[
            tw`absolute left-5 right-5 bottom-10 bg-white rounded-[24px] p-6`,
            {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 10,
            },
          ]}
        >
          <Text style={tw`text-2xl font-bold text-[#3D3D3D] mb-5`}>
            Nuevo Pedido
          </Text>

          <View style={tw`flex-row items-center mb-6`}>
            <View style={tw`w-[60px] h-[60px] rounded-[16px] bg-[#FFF5F0] items-center justify-center mr-4`}>
              <ShoppingBag size={32} color="#C86F4F" strokeWidth={2} />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-[#3D3D3D] mb-2`}>
                {newOrder.restaurant}
              </Text>
              <View style={tw`flex-row`}>
                <Text style={tw`text-sm text-[#757575] mr-4`}>{newOrder.address}</Text>
                <Text style={tw`text-sm text-[#757575] mr-4`}>{newOrder.distance}</Text>
                <Text style={tw`text-sm text-[#757575]`}>{newOrder.time}</Text>
              </View>
            </View>
          </View>

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
        </View>
      )}
    </View>
  );
}
