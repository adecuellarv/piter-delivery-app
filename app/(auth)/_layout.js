import { Stack } from "expo-router";
import { View, Image } from "react-native";
import tw from "../../tw";
import logo from "../../assets/icon.png";

export default function AuthLayout() {
  return (
    <View style={tw`flex-1 bg-[#E8E3D8]`}>
      <View style={tw`items-center pt-10`}>
        <Image
          source={logo}
          style={{ width: 190, height: 100 }}
          resizeMode="contain"
        />
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: tw`bg-[#E8E3D8]`,
        }}
      />
    </View>
  );
}
