import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface InclinedButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const InclinedButton: React.FC<InclinedButtonProps> = ({
  children,
  className = '',
}) => {
  return (
    <View className={`-skew-x-12 bg-green-500 px-4 py-2 ${className}`}>
      {/* <Text className="text-white font-semibold text-base skew-x-12"> */}
      {children}
      {/* </Text> */}
    </View>
  );
};
