import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from "expo-router";
import tw from '../../tw'

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor introduce tu correo y contraseña');
      return;
    }

    setLoading(true);

    try {
      router.replace("/(app)/home");
      /*
      const response = await fetch('https://tu-api.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Login exitoso');
      } else {
        Alert.alert('Error', data.message || 'Token inválido');
      }*/
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueRegister = () => {
    router.push("/(auth)/continue-register");
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={tw`flex-1 justify-center items-center px-8 pb-20`}>
        <Text
          style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}
        >
          Correo
        </Text>

        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D] mb-3`}
          placeholder="Introduce tu correo"
          placeholderTextColor="#999"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <Text
          style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}
        >
          Contraseña
        </Text>

        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D] mb-3`}
          placeholder="Introduce tu contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity
          style={tw`w-full bg-[#C86F4F] rounded-[16px] py-2 items-center shadow-lg mb-8`}
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
          onPress={handleContinueRegister}
          activeOpacity={0.7}
        >
          <Text
            style={tw`text-[#C86F4F] text-base font-semibold underline`}
          >
            Seguir registro
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
