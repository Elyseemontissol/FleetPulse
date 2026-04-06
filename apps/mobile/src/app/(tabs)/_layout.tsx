import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="inspections"
        options={{
          title: 'Inspections',
          headerTitle: 'DVIR Inspections',
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: 'Work Orders',
          headerTitle: 'Work Orders',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}
