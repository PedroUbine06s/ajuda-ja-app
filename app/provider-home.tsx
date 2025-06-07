import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProviderHomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  let displayData: any = {};
  try {
    displayData = {
      user: params.user ? JSON.parse(params.user as string) : null,
      token: params.token || null,
    };
  } catch (e: any) {
    console.error("Failed to parse params in ProviderHomeScreen:", e);
    displayData = { ...params, parsingError: e.message };
  }

  const dumpedParams = JSON.stringify(displayData, null, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Raw Provider Data:</Text>

      <ScrollView style={styles.jsonTextContainer}>
        <Text style={styles.jsonText}>{dumpedParams}</Text>
      </ScrollView>

      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  jsonTextContainer: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    flexShrink: 1,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#333',
  },
});