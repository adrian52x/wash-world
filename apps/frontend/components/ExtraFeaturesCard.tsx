import React from 'react';
import { View, Text, Button } from 'react-native';
import LoadingSpinner from './ui/LoadingSpinner';
import { WashStats } from '@/types/types';
import { Trophy } from 'lucide-react-native';
import { APIError } from '@/api/errorAPI';

interface ExtraFeaturesCardProps {
  loading: boolean;
  error?: APIError | null;
  stats?: WashStats;
  onDowngrade: () => void;
}

export const ExtraFeaturesCard: React.FC<ExtraFeaturesCardProps> = ({ loading, error, stats, onDowngrade }) => (
  <View className="mb-6 p-6 rounded-lg bg-white shadow border border-gray-100">
    <View className="flex-row items-center mb-2 gap-1">
      <Trophy color="#16a34a" size={20} />
      <Text className="text-lg font-bold text-green-700">Wash Stats</Text>
    </View>
    {loading ? (
      <LoadingSpinner />
    ) : error ? (
      error.statusCode === 404 ? (
        <Text className="text-gray-400 mb-2">No wash sessions/stats yet.</Text>
      ) : (
        <Text className="text-red-500 mb-2">{error.message}</Text>
      )
    ) : (
      <>
        <View className="gap-2 mb-2">
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
            <Text className="text-gray-500">Total spent:</Text>
            <Text className="font-semibold text-gray-900">{stats?.totalSpent ?? 0} DKK</Text>
          </View>
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
            <Text className="text-gray-500">Favorite wash:</Text>
            <Text className="font-semibold text-gray-900">
              {stats?.favoriteWashType?.type ?? '-'} ({stats?.favoriteWashType?.useCount ?? 0})
            </Text>
          </View>
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
            <Text className="text-gray-500">Favorite location:</Text>
            <Text className="font-semibold text-gray-900">
              {stats?.mostUsedLocation?.name ?? '-'} ({stats?.mostUsedLocation?.visitCount ?? 0})
            </Text>
          </View>
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
            <Text className="text-gray-500">Last month washes:</Text>
            <Text className="font-semibold text-gray-900">{stats?.lastMonthWashes ?? 0}</Text>
          </View>
        </View>
        <Button title="Downgrade to Regular User" color="#10b981" onPress={onDowngrade} />
      </>
    )}
  </View>
);
