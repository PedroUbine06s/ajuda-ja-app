import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function UserHomeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  let displayData: any = {};

  console.log("UserHomeScreen - Raw params from useLocalSearchParams:", params);

  try {
    if (params.user && typeof params.user === 'string') {
      displayData.user = JSON.parse(params.user);
    } else {
      displayData.user = params.user;
    }

    if (params.token) {
      displayData.token = params.token;
    } else {
      displayData.token = null;
    }

  } catch (e: any) {
    console.error("Failed to parse 'user' parameter in UserHomeScreen:", e);
    displayData = { ...params, parsingError: e.message };
  }

  const dumpedParams = JSON.stringify(displayData, null, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Raw Login Data:</Text>

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