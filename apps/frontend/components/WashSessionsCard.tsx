import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WashSession } from '@/types/types';
import LoadingSpinner from './ui/LoadingSpinner';
import { Sparkles } from 'lucide-react-native';

interface WashSessionsCardProps {
  sessions: WashSession[];
  loading: boolean;
  error?: { message: string } | null;
  onSeeAll: () => void;
}

export const WashSessionsCard: React.FC<WashSessionsCardProps> = ({
  sessions,
  loading,
  error,
  onSeeAll,
}) => (
  <View className="mb-6 p-6 rounded-lg bg-white shadow border border-gray-100">
    <View className="flex-row items-center mb-2 gap-1">
        <Sparkles color="#16a34a" size={20}/>
        <Text className="text-lg font-bold text-green-700">Wash Sessions History</Text>
    </View>
    {loading ? (
      <LoadingSpinner />
    ) : error ? (
      <Text className="text-red-500 mb-2">{error.message}</Text>
    ) : (
      <>
        {(sessions ?? []).slice(0, 3).map((wash) => (
        <View
            key={wash.washId}
            className="mb-3 pb-3 border-b border-gray-100 flex-row items-center"
        >
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
        {sessions.length > 3 && (
          <TouchableOpacity
            className="mt-2 py-2 rounded bg-green-light active:bg-green-200"
            onPress={onSeeAll}
          >
            <Text className="text-center text-white font-semibold">See All</Text>
          </TouchableOpacity>
        )}
      </>
    )}
  </View>
);