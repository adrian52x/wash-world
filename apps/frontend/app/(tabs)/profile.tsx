import { useWashSessions } from '@/hooks/useWashSessions';
import { logout, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'expo-router';
import { ScrollView, View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  //------------------------------------
  //to check this...
  const userSession = useAppSelector(selectUserSession);
  if (!userSession) return null;
  //------------------------------------

  const { washSessions } = useWashSessions();

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

        {/* Testing */}
        <Text className="text-lg font-bold mb-2">Your Wash Sessions</Text>
        {washSessions && washSessions.length > 0 ? (
          washSessions.map((wash: any) => (
            <View
              key={wash.washId}
              className="mb-4 p-3 border border-gray-200 rounded-lg bg-white"
            >
              <Text className="font-semibold">{wash.location.name}</Text>
              <Text>{wash.location.address}</Text>
              <Text>
                {wash.washType.type} - {wash.washType.price} DKK
              </Text>
              <Text className="text-xs text-gray-500">
                {new Date(wash.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text>No wash sessions found.</Text>
        )}

        <Text>Welcomeee {userSession.username}</Text>

        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}
