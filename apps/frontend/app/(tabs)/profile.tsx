import { UpdateUserForm } from '@/components/UpdateUserForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUpdateUser } from '@/hooks/useUsers';
import { useWashSessions } from '@/hooks/useWashSessions';
import { fetchUserSession, logout, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { UpdateUser, WashSession } from '@/types/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userSession = useAppSelector(selectUserSession);
  const { washSessions, loadingWashSessions, errorWashSessions } = useWashSessions();
  const { updateUser } = useUpdateUser();

  // Check if onboarding is needed
  const needsOnboarding =
    !userSession?.user.phoneNumber ||
    !userSession?.user.address ||
    !userSession?.user.licensePlate;

  // State to control the visibility of the update form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

    // Handle form submit
  const handleUpdateSubmit = async (values: UpdateUser) => {
    await updateUser.mutateAsync(
      {
        phoneNumber: values.phoneNumber,
        address: values.address,
        licensePlate: values.licensePlate,
        password: values.password,
        username: values.username,
      },
      {
        onSuccess: () => {
          dispatch(fetchUserSession());
          setShowUpdateForm(false);
        },
      }
    );
  };

  // For the first time, in ProfileScreen, user has to complete the onboarding form
  if (needsOnboarding) {
    return (
      <UpdateUserForm
        initialValues={{
          phoneNumber: userSession?.user.phoneNumber ?? '',
          address: userSession?.user.address ?? '',
          licensePlate: userSession?.user.licensePlate ?? '',
        }}
        onSubmit={handleUpdateSubmit}
      />
    );
  }

  // Handle update user 
  if (showUpdateForm && userSession) {
    return (
      <UpdateUserForm
        initialValues={{
          phoneNumber: userSession.user.phoneNumber ?? '',
          address: userSession.user.address ?? '',
          licensePlate: userSession.user.licensePlate ?? '',
          username: userSession.user.username ?? '',
          password: '',
        }}
        onSubmit={handleUpdateSubmit}
        showUsername
        onCancel={() => setShowUpdateForm(false)}
      />
    );
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">

        {userSession ? (
          <>
            <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <Text className="text-xl font-bold mb-1">{userSession.user.username}</Text>
              <Text className="text-gray-700 mb-1">{userSession.user.email}</Text>
              <Text className="text-gray-500 mb-1">License Plate: {userSession.user.licensePlate}</Text>
              <Text className="text-gray-500 mb-1">Phone: {userSession.user.phoneNumber}</Text>
              <Text className="text-gray-500 mb-1">Address: {userSession.user.address}</Text>
              {userSession.userMembership && (
                <Text className="text-green-600 font-semibold">
                  Membership: {userSession.userMembership.membership.type}
                </Text>
              )}
              <Button title="Update Profile" onPress={() => setShowUpdateForm(true)} />
            </View>
          </>
        ) : (
          null
        )}

        {/* Testing */}
        <Text className="text-lg font-bold mb-2">Your Wash Sessions</Text>

        {loadingWashSessions ? (
          <LoadingSpinner />
        ) : errorWashSessions ? (
          <Text className="text-red-500 mb-2">{errorWashSessions}</Text>
        ) : (
          (washSessions ?? []).map((wash: WashSession) => (
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
        )}


        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}
