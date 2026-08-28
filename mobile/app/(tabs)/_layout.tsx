import { Tabs } from 'expo-router';
import React from 'react';
import { Home, PlusCircle, Handshake } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1C2541',
          borderTopColor: '#3A506B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#94A3B8',
        headerStyle: { backgroundColor: '#0B132B' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kisan Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="list-harvest"
        options={{
          title: 'List Harvest',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Buyer Bids',
          tabBarIcon: ({ color, size }) => <Handshake color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
