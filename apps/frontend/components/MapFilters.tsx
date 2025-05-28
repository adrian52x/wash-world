import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface MapFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const FILTERS = {
  AUTO: 'auto',
  SELF: 'self',
};

export const MapFilters: React.FC<MapFiltersProps> = ({ filter, setFilter }) => (
  <View className="absolute left-[20px] right-[20px] top-[10px] z-10 flex-row">
    <TouchableOpacity
      className={`flex-1 px-4 py-3  border border-green-500 ${filter === FILTERS.AUTO ? 'bg-green-500' : 'bg-white'}`}
      onPress={() => setFilter(FILTERS.AUTO)}
    >
      <Text className={`${filter === FILTERS.AUTO ? 'text-white' : 'text-green-500'} font-semibold text-center`}>
        Auto Wash
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      className={`flex-1 px-4 py-3 border-t border-b border-r border-green-500 ${filter === FILTERS.SELF ? 'bg-green-500' : 'bg-white'}`}
      onPress={() => setFilter(FILTERS.SELF)}
    >
      <Text className={`${filter === FILTERS.SELF ? 'text-white' : 'text-green-500'} font-semibold text-center`}>
        Self Wash
      </Text>
    </TouchableOpacity>
  </View>
);
