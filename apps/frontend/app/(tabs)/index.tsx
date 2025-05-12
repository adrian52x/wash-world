import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        <ThemedText type="header">Map to come...</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
