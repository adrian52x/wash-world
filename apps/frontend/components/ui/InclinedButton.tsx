import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface InclinedButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const InclinedButton: React.FC<InclinedButtonProps> = ({
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <View
      className={`-skew-x-12 px-4 py-2 ${
        disabled ? 'bg-gray-400' : 'bg-green-500'
      } ${className}`}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </View>
  );
};
