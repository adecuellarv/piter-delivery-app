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
import tw from '../../tw';

export default function HomeScreen() {
 
  return (
    <View style={tw`flex-1 bg-[#E8E3D8] justify-center items-center px-8`}>
      <Text>Hola</Text>
    </View>
  );
}
