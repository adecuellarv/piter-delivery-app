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
  Image,
} from 'react-native';
import { HelpCircle, Eye, EyeOff, Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import tw from '../../tw';
import { createAccount } from '../../api/login';
import { useAuthStore } from '../../store/authStore';

const logo = require('../../assets/logo_piter_east.png');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d+$/;

const TOOLTIPS = {
  correo: 'Debe coincidir con el correo que enviaste en tu solicitud de registro.',
  telefono: 'Debe coincidir con el teléfono que enviaste en tu solicitud.',
};

const PASSWORD_RULES = [
  { key: 'length',    label: 'Mínimo 8 caracteres',          test: (p) => p.length >= 8 },
  { key: 'number',    label: 'Al menos un número',            test: (p) => /\d/.test(p) },
  { key: 'upper',     label: 'Al menos una mayúscula',        test: (p) => /[A-Z]/.test(p) },
  { key: 'lower',     label: 'Al menos una minúscula',        test: (p) => /[a-z]/.test(p) },
  { key: 'special',   label: 'Al menos un carácter especial', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const BTN = {
  height: 50,
  backgroundColor: '#C2674A',
  borderRadius: 13,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  shadowColor: '#C2674A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.6,
  shadowRadius: 10,
  elevation: 6,
};

export default function ContinueRegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState({ correo: '', telefono: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [touched, setTouched] = useState({ correo: false, telefono: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateField = (field, value) => setForm((cur) => ({ ...cur, [field]: value }));
  const toggleTooltip = (field) => setActiveTooltip((cur) => (cur === field ? null : field));

  const handleBlur = (field) => {
    setTouched((cur) => ({ ...cur, [field]: true }));
    setFocused(null);
  };

  // Derived validation
  const emailValid = EMAIL_REGEX.test(form.correo.trim());
  const phoneValid = PHONE_REGEX.test(form.telefono.trim()) && form.telefono.trim().length >= 10;
  const passwordChecks = PASSWORD_RULES.map((r) => ({ ...r, valid: r.test(form.password) }));
  const allPasswordValid = passwordChecks.every((r) => r.valid);
  const passwordsMatch = form.password === form.confirmPassword;

  const correoError    = touched.correo && form.correo.length > 0 && !emailValid;
  const telefonoError  = touched.telefono && form.telefono.length > 0 && !phoneValid;
  const passwordError  = touched.password && form.password.length > 0 && !allPasswordValid;
  const confirmError   = touched.confirmPassword && form.confirmPassword.length > 0 && !passwordsMatch;

  const showRules = focused === 'password' || (form.password.length > 0);

  const inputStyle = (field, hasError = false) => ({
    height: 46,
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

  const handleBecomeMember = async () => {
    if (loading) return;
    setTouched({ correo: true, telefono: true, password: true, confirmPassword: true });

    const { correo, telefono, password, confirmPassword } = form;
    if (!correo.trim() || !telefono.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!emailValid)        { Alert.alert('Error', 'Introduce un correo válido'); return; }
    if (!phoneValid)        { Alert.alert('Error', 'El teléfono solo debe contener números'); return; }
    if (!allPasswordValid)  { Alert.alert('Error', 'La contraseña no cumple todos los requisitos'); return; }
    if (!passwordsMatch)    { Alert.alert('Error', 'Las contraseñas no coinciden'); return; }

    setLoading(true);
    try {
      const data = await createAccount({ correo: correo.trim(), telefono: telefono.trim(), password });
      setSession(data?.usuario ?? { correo: correo.trim(), telefono: telefono.trim() });
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const LabelWithTooltip = ({ field, label }) => (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#3D3933' }}>{label}</Text>
        <TouchableOpacity
          style={{ marginLeft: 6 }}
          onPress={() => toggleTooltip(field)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <HelpCircle size={15} color="#A39B8E" />
        </TouchableOpacity>
      </View>
      {activeTooltip === field && (
        <View style={{ backgroundColor: '#1A1815', borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <Text style={{ color: '#fff', fontSize: 12, lineHeight: 17 }}>{TOOLTIPS[field]}</Text>
        </View>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center px-7 pb-10`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`items-center mb-8`}>
          <Image source={logo} style={{ width: 140, height: 70 }} resizeMode="contain" />
        </View>

        {/* ─── Correo ─── */}
        <LabelWithTooltip field="correo" label="Correo" />
        <TextInput
          style={{ ...inputStyle('correo', correoError), marginBottom: correoError ? 4 : 14 }}
          placeholder="Introduce tu correo"
          placeholderTextColor="#A39B8E"
          value={form.correo}
          onChangeText={(v) => updateField('correo', v)}
          onFocus={() => setFocused('correo')}
          onBlur={() => handleBlur('correo')}
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

        {/* ─── Teléfono ─── */}
        <LabelWithTooltip field="telefono" label="Teléfono" />
        <TextInput
          style={{ ...inputStyle('telefono', telefonoError), marginBottom: telefonoError ? 4 : 14 }}
          placeholder="Introduce tu teléfono"
          placeholderTextColor="#A39B8E"
          value={form.telefono}
          onChangeText={(v) => updateField('telefono', v.replace(/\D/g, ''))}
          onFocus={() => setFocused('telefono')}
          onBlur={() => handleBlur('telefono')}
          autoCorrect={false}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        {telefonoError && (
          <Text style={{ color: '#D94F35', fontSize: 12, marginBottom: 10 }}>
            Introduce un teléfono válido (mínimo 10 dígitos)
          </Text>
        )}

        {/* ─── Contraseña ─── */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#3D3933', marginBottom: 6 }}>
          Contraseña
        </Text>
        <View>
          <TextInput
            style={{ ...inputStyle('password', passwordError), paddingRight: 46 }}
            placeholder="Crea una contraseña"
            placeholderTextColor="#A39B8E"
            value={form.password}
            onChangeText={(v) => updateField('password', v)}
            onFocus={() => setFocused('password')}
            onBlur={() => handleBlur('password')}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 13, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            {showPassword ? <EyeOff size={18} color="#A39B8E" /> : <Eye size={18} color="#A39B8E" />}
          </TouchableOpacity>
        </View>

        {/* Reglas de contraseña */}
        {showRules && (
          <View style={{ marginTop: 10, marginBottom: 4 }}>
            {passwordChecks.map((rule) => (
              <View key={rule.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <View style={{ marginRight: 7 }}>
                  {rule.valid
                    ? <Check size={13} color="#3DAA6E" strokeWidth={2.5} />
                    : <X    size={13} color="#D94F35" strokeWidth={2.5} />}
                </View>
                <Text style={{ fontSize: 12, color: rule.valid ? '#3DAA6E' : '#8A8377' }}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: showRules ? 10 : 14 }} />

        {/* ─── Confirmar contraseña ─── */}
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#3D3933', marginBottom: 6 }}>
          Confirmar contraseña
        </Text>
        <View>
          <TextInput
            style={{ ...inputStyle('confirmPassword', confirmError), paddingRight: 46, marginBottom: confirmError ? 4 : 14 }}
            placeholder="Confirma tu contraseña"
            placeholderTextColor="#A39B8E"
            value={form.confirmPassword}
            onChangeText={(v) => updateField('confirmPassword', v)}
            onFocus={() => setFocused('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showConfirm}
            textContentType="newPassword"
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 13, top: 0, bottom: 0, justifyContent: 'center' }}
            onPress={() => setShowConfirm((v) => !v)}
            activeOpacity={0.7}
          >
            {showConfirm ? <EyeOff size={18} color="#A39B8E" /> : <Eye size={18} color="#A39B8E" />}
          </TouchableOpacity>
        </View>
        {confirmError && (
          <Text style={{ color: '#D94F35', fontSize: 12, marginBottom: 10 }}>
            Las contraseñas no coinciden
          </Text>
        )}

        {/* ─── Botón ─── */}
        <TouchableOpacity style={BTN} onPress={handleBecomeMember} disabled={loading} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
            {loading ? 'Cargando...' : 'Ser miembro'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={{ fontSize: 13, color: '#C2674A', fontWeight: '500' }}>
            Volver a iniciar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
