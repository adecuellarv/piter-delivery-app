import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import tw from '../../tw';
import { useAuthStore } from '../../store/authStore';
import { loginDriver } from '../../api/login';

const logo = require('../../assets/logo_piter_east.png');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BTN = {
  height: 50,
  backgroundColor: '#C2674A',
  borderRadius: 13,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
  shadowColor: '#C2674A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.6,
  shadowRadius: 10,
  elevation: 6,
};

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [touchedCorreo, setTouchedCorreo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = EMAIL_REGEX.test(correo.trim());
  const correoError = touchedCorreo && correo.length > 0 && !emailValid;

  const inputStyle = (field, hasError = false) => ({
    height: 48,
    backgroundColor: '#FCFBF8',
    borderWidth: 1,
    borderColor: hasError ? '#D94F35' : focused === field ? '#C2674A' : 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#1A1815',
    ...(hasError
      ? { shadowColor: '#D94F35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.18, shadowRadius: 4 }
      : focused === field
      ? { shadowColor: '#C2674A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 2 }
      : {}),
  });

  const handleLogin = async () => {
    setTouchedCorreo(true);
    if (!correo.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor introduce tu correo y contraseña');
      return;
    }
    if (!emailValid) {
      Alert.alert('Error', 'Por favor introduce un correo válido');
      return;
    }
    setLoading(true);
    try {
      const session = await loginDriver({ correo: correo.trim(), password });

      setSession({
        ...(session.usuario ?? {}),
        correo: correo.trim(),
        token: session.token,
        deviceId: session.deviceId,
        uid: session.user.uid,
        loginData: session.data,
      });
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center px-7 pb-10`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`items-center mb-10`}>
          <Image source={logo} style={{ width: 160, height: 80 }} resizeMode="contain" />
        </View>

        {/* Correo */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#3D3933', marginBottom: 6 }}>
          Correo
        </Text>
        <TextInput
          style={{ ...inputStyle('correo', correoError), marginBottom: correoError ? 4 : 14 }}
          placeholder="Introduce tu correo"
          placeholderTextColor="#A39B8E"
          value={correo}
          onChangeText={setCorreo}
          onFocus={() => setFocused('correo')}
          onBlur={() => { setFocused(null); setTouchedCorreo(true); }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        {correoError && (
          <Text style={{ color: '#D94F35', fontSize: 12, marginBottom: 10 }}>
            Introduce un correo válido (ejemplo@correo.com)
          </Text>
        )}

        {/* Contraseña */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#3D3933', marginBottom: 6 }}>
          Contraseña
        </Text>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            style={{ ...inputStyle('password'), paddingRight: 46 }}
            placeholder="Introduce tu contraseña"
            placeholderTextColor="#A39B8E"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            textContentType="password"
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 13, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            {showPassword
              ? <EyeOff size={18} color="#A39B8E" />
              : <Eye size={18} color="#A39B8E" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={tw`self-end mb-5`} activeOpacity={0.7}>
          <Text style={{ fontSize: 13, color: '#8A8377' }}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={BTN} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
            {loading ? 'Cargando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={tw`items-center gap-y-1.5`}>
          <Text style={{ fontSize: 13, color: '#3D3933' }}>
            ¿No tienes cuenta?{' '}
            <Text
              style={{ color: '#C2674A', fontWeight: '600' }}
              onPress={() =>
                Linking.openURL(
                  'https://wa.me/521XXXXXXXXXX?text=Hola%2C%20quiero%20registrarme%20en%20Piter%20Eats'
                )
              }
            >
              Regístrate por WhatsApp
            </Text>
          </Text>
          <Text style={{ fontSize: 13, color: '#3D3933' }}>
            ¿Ya enviaste tu solicitud?{' '}
            <Text
              style={{ color: '#C2674A', fontWeight: '600' }}
              onPress={() => router.push('/(auth)/continue-register')}
            >
              Seguir registro
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
