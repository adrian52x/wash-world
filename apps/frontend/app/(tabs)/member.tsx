import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';

export default function MemberScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        <ThemedText type="header">Member Area</ThemedText>
        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
