import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import tw from '../../tw';

export default function ContinueRegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleBecomeMember = () => {
    const { correo, telefono, password, confirmPassword } = form;

    if (!correo.trim() || !telefono.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const phoneNumber = '+524426012026';
    const message = [
      'Hola, quiero ser miembro de PITER EATS',
      `Correo: ${correo}`,
      `Telefono: ${telefono}`,
    ].join('\n');
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }

        Alert.alert('Error', 'WhatsApp no está instalado');
        return null;
      })
      .catch((err) => console.error('Error al abrir WhatsApp:', err));
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center px-8 pb-8`}
        keyboardShouldPersistTaps="handled"
      >


        <Text style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}>
          Correo
        </Text>
        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D] `}
          placeholder="Introduce tu correo"
          placeholderTextColor="#999"
          value={form.correo}
          onChangeText={(value) => updateField('correo', value)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Text style={tw`text-[#666] text-sm self-start mb-3 mt-1`}>
          El correo debe ser igual al que enviaste en tu solicitud de registro.
        </Text>

        <Text style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}>
          Teléfono
        </Text>
        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D]`}
          placeholder="Introduce tu teléfono"
          placeholderTextColor="#999"
          value={form.telefono}
          onChangeText={(value) => updateField('telefono', value)}
          autoCorrect={false}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
          <Text style={tw`text-[#666] text-sm self-start mb-3 mt-1`}>
          El teléfono debe ser igual al que enviaste en tu solicitud de registro.
        </Text>

        <Text style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}>
          Contraseña
        </Text>
        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D] mb-3`}
          placeholder="Crea una contraseña"
          placeholderTextColor="#999"
          value={form.password}
          onChangeText={(value) => updateField('password', value)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="newPassword"
        />

        <Text style={tw`text-[#3D3D3D] text-xl font-semibold self-start`}>
          Confirmar contraseña
        </Text>
        <TextInput
          style={tw`w-full bg-white border-2 border-[#3D3D3D] rounded-[16px] px-4 pt-2 pb-3 text-lg text-[#3D3D3D] mb-3`}
          placeholder="Confirma tu contraseña"
          placeholderTextColor="#999"
          value={form.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="newPassword"
        />

        <TouchableOpacity
          style={tw`w-full bg-[#C86F4F] rounded-[16px] py-2 items-center shadow-lg mb-8`}
          onPress={handleBecomeMember}
          activeOpacity={0.8}
        >
          <Text style={tw`text-white text-xl font-bold tracking-wider`}>
            SER MIEMBRO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`items-center`}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={tw`text-[#C86F4F] text-md font-semibold underline`}>
            Volver a iniciar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
