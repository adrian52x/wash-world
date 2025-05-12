import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Location } from '@/types';

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
      locations.filter(loc =>
        loc.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <View style={styles.searchContainer} >
      <TextInput
        style={styles.input} className="bg-white "
        placeholder="Search location..."
        value={search}
        onChangeText={handleSearch}
      />
      {results.length > 0 && (
        <FlatList
          style={styles.results}
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setSearch('');
                setResults([]);
              }}
            >
              <Text style={styles.resultItem}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    fontSize: 26,
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  results: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
  },
});