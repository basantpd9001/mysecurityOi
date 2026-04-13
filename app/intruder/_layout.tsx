import { Stack } from 'expo-router';

export default function IntruderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setup" />
      <Stack.Screen name="history" />
      <Stack.Screen name="alert-detail" />
      <Stack.Screen name="map-view" />
      <Stack.Screen name="emergency-contacts" />
    </Stack>
  );
}
