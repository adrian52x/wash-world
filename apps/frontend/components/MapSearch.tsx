import { Location } from '@/types/types';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';

type Props = {
  locations: Location[];
  onSelect: (location: Location) => void;
};

export default function MapSearch({ locations, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Location[]>([]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length === 0) {
      setResults([]);
      return;
    }
    setResults(
      locations.filter((loc) =>
        loc.address.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  return (
    <View className="absolute top-[60px] left-[20px] right-[20px] z-10">
      <TextInput
        className="bg-white px-4 py-2 text-xl shadow"
        placeholder="Search location..."
        value={search}
        onChangeText={handleSearch}
      />
      {results.length > 0 && (
        <FlatList
          className="bg-white rounded-b-xl mt-2 max-h-40"
          data={results}
          keyExtractor={(item) => item.locationId.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                onSelect(item);
                setSearch('');
                setResults([]);
              }}
            >
              <View className="px-4 py-3 border-b border-gray-200">
                <Text className="font-bold text-base">{item.name}</Text>
                <Text className="text-xs text-gray-500">{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
