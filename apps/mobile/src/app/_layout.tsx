import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="inspection/new" options={{ title: 'New Inspection' }} />
      <Stack.Screen name="inspection/[id]" options={{ title: 'Inspection Details' }} />
      <Stack.Screen name="work-order/[id]" options={{ title: 'Work Order Details' }} />
    </Stack>
  );
}
