import React from 'react';
import { View } from 'react-native';
import { Link, Redirect } from 'expo-router';

export default function Index() {
  return (
    <Redirect href="/login" />
  );
}