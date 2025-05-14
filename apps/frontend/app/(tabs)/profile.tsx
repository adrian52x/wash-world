import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppSelector } from '@/redux/hooks';
import { ScrollView } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        {/* just to test: */}
        <ThemedText type="header">Welcome, {user?.email}</ThemedText>
        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
