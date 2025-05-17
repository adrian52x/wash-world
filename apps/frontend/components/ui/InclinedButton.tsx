import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface InclinedButtonProps {
  children: React.ReactNode;
}

export const InclinedButton: React.FC<InclinedButtonProps> = ({ children }) => {
  return (
    <View className="-skew-x-12 bg-green-500 px-4 py-2 ">
      <Text className="text-white font-semibold text-base skew-x-12">
        {children}
      </Text>
    </View>
  );
};
