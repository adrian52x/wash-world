import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}
