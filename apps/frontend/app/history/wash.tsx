import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useWashSessions } from '@/hooks/useWashSessions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Stack } from 'expo-router';

export default function AllWashSessionsScreen() {
  const { washSessions, loadingWashSessions, errorWashSessions } = useWashSessions();

  return (
    <View className="flex-1 bg-white/60">
      <Stack.Screen
        options={{
          headerTitle: '',
          headerBackTitle: 'Back',
        }}
      />
      <Text className="text-xl font-bold text-green-700 p-4">All Wash Sessions ({washSessions?.length})</Text>
      {loadingWashSessions ? (
        <LoadingSpinner />
      ) : errorWashSessions ? (
        <Text className="text-red-500 p-4">{errorWashSessions.message}</Text>
      ) : (
        <ScrollView contentContainerClassName="p-4">
          {(washSessions ?? []).map((wash) => (
            <View key={wash.washId} className="mb-3 pb-3 border-b border-gray-200 flex-row items-center">
              <View className="flex-1">
                <Text className="font-semibold">{wash.location.name}</Text>
                <Text className="text-xs text-gray-500">{wash.location.address}</Text>
                <Text className="text-sm text-green-light">{wash.washType.type} Wash</Text>
              </View>
              <View className="items-end ml-2">
                <Text className="text-slate-600 font-semibold">{wash.amountPaid} DKK</Text>
                <Text className="text-xs text-gray-400">{new Date(wash.createdAt).toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
