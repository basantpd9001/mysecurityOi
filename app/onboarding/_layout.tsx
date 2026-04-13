import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="set-pin" />
      <Stack.Screen name="emergency-contacts" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
