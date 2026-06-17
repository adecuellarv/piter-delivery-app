import { View, Text } from "react-native";
import tw from "../../tw";

export default function ZonasScreen() {
  return (
    <View style={tw`flex-1 bg-[#1C1C1C] items-center justify-center`}>
      <Text style={tw`text-white text-xl font-semibold`}>Zonas</Text>
    </View>
  );
}
