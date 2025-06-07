import React from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/login">Ir para Login</Link>
    </View>
  );
}