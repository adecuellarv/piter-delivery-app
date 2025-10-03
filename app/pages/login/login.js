import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import tw from  '../../../tw'
import logo from './img/piter-eats-logo.png';

export default function LoginScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Por favor introduce tu token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://tu-api.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Login exitoso');
      } else {
        Alert.alert('Error', data.message || 'Token inválido');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = '1234567890';
    const message = 'Hola, quiero ser miembro de PITER EATS';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp no está instalado');
        }
      })
      .catch((err) => console.error('Error al abrir WhatsApp:', err));
  };

  return (
    <View style={tw`flex-1 bg-[#E8E3D8] justify-center items-center px-8`}>
      {/* Logo */}
      <View style={tw`items-center mb-12`}>
        <View
          style={tw`w-48 h-48 items-center justify-center shadow-lg mb-8`}
        >
          <Image
            source={logo}
            style={{ width: 290, height: 290 }}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text
        style={tw`text-[#3D3D3D] text-2xl font-semibold mb-4 self-start`}
      >
        Token
      </Text>

      <TextInput
        style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-6 py-4 text-lg text-[#3D3D3D] mb-6`}
        placeholder="Introduce tu token"
        placeholderTextColor="#999"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={tw`w-full bg-[#C86F4F] rounded-[16px] py-5 items-center shadow-lg mb-8`}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={tw`text-white text-xl font-bold tracking-wider`}>
          {loading ? 'CARGANDO...' : 'ENTRAR'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={handleWhatsApp}
        activeOpacity={0.7}
      >
        <Text
          style={tw`text-[#C86F4F] text-md font-semibold underline mr-2`}
        >
          Ser miembro
        </Text>
      </TouchableOpacity>
    </View>
  );
}
