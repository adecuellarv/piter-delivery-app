import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Agrega más pantallas aquí si quieres, con sus propias options */}
    </Stack>
  );

}
