import { useAppSelector } from '@/redux/hooks';
import { ScrollView, View, Text } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        {/* just to test: */}
        <Text>Welcome, {user?.email}</Text>
        <Text>This app includes example code to help you get started.</Text>
      </ScrollView>
    </View>
  );
}
