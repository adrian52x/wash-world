import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { fakeLocations } from '@/constants/fakeData';

export default function LocationDetails() {
  const { id } = useLocalSearchParams();
  const location = fakeLocations.find((l) => l.id === Number(id));

  if (!location) return <Text>Location not found</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: location.title,
          headerTitle: '',
          headerBackTitle: 'Back',
        }}
      />
      <Text style={styles.title}>{location.title}</Text>
      <Text>Opening hours: {location.openingHours}</Text>
      <Text>Address: {location.address}</Text>
      <Text>Auto Wash Halls: {location.autoWashHalls}</Text>
      <Text>Self Wash Halls: {location.selfWashHalls}</Text>
      {/* Add more details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
