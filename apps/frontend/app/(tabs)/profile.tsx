import { logout } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'expo-router';
import { ScrollView, View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login'); // 👈 optional: navigate to login
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        {/* just to test: */}
        <Text>Welcome, {user?.email}</Text>
        <Text>This app includes example code to help you get started.</Text>
        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}
