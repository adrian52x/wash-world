import { logout, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'expo-router';
import { ScrollView, View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const userSession = useAppSelector(selectUserSession);
  // if (!userSession) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login'); // 👈 optional: navigate to login
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        <Text>
          Helloooo, I tested with mock data, and it works, and I commented out
          the next lines of code, but when we merge they should work
        </Text>

        {/* <Text>Welcome {userSession.username}</Text>
        {userSession.userMembership && (
          <Text>Membership: {userSession.userMembership.membership.type}</Text>
        )} */}

        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}
