import { UpdateUserForm } from '@/components/UpdateUserForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUpdateUser } from '@/hooks/useUsers';
import { useWashSessions } from '@/hooks/useWashSessions';
import { fetchUserSession, logout, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RoleEnum } from '@/types/enums';
import { UpdateUser, WashSession } from '@/types/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, Text, Button, Alert } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userSession = useAppSelector(selectUserSession);
  const { washSessions, loadingWashSessions, errorWashSessions } =
    useWashSessions();
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
          dispatch(fetchUserSession({}));
          setShowUpdateForm(false);
        },
      },
    );
  };

  // Handle role upgrade
  const handleUpgradeRole = async (role: RoleEnum) => {
    await updateUser.mutateAsync(
      { role },
      {
        onSuccess: () => {
          dispatch(fetchUserSession({}));
        },
      },
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
      {/* Loading state on update user */}
      {updateUser.isPending && (
        <View className="absolute inset-0 z-50 justify-center items-center bg-white/60">
          <LoadingSpinner />
        </View>
      )}

      <ScrollView contentContainerClassName="p-4 space-y-2 pb-[100px]">
        {userSession ? (
          <>
            <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <Text className="text-xl font-bold mb-1">
                {userSession.user.username}
              </Text>
              <Text className="text-gray-700 mb-1">
                {userSession.user.email}
              </Text>
              <Text className="text-gray-500 mb-1">
                License Plate: {userSession.user.licensePlate}
              </Text>
              <Text className="text-gray-500 mb-1">
                Phone: {userSession.user.phoneNumber}
              </Text>
              <Text className="text-gray-500 mb-1">
                Address: {userSession.user.address}
              </Text>
              <Text className="text-gray-500 mb-1">
                Role: {userSession.user.role}
              </Text>
              {userSession.userMembership && (
                <Text className="text-green-600 font-semibold">
                  Membership: {userSession.userMembership.membership.type}
                </Text>
              )}
              <Button
                title="Update Profile"
                onPress={() => setShowUpdateForm(true)}
              />
            </View>
          </>
        ) : null}

        {/* Upgrade button */}
        {userSession?.user.role === RoleEnum.User && (
          <>
            <Text className="text-lg font-bold">Upgrade User</Text>
            <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <Button
                title="Upgrade to Premium User"
                onPress={() =>
                  Alert.alert(
                    'Confirm Upgrade',
                    'Are you sure you want to upgrade to PREMIUM USER?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Upgrade',
                        onPress: () => handleUpgradeRole(RoleEnum.PremiumUser),
                      },
                    ],
                  )
                }
              />
            </View>
          </>
        )}

        {/* Extra features for Premium user*/}
        {userSession?.user.role === RoleEnum.PremiumUser && (
          <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
            <Text className="text-lg font-bold mb-2">Premium Features</Text>
            <Text className="text-gray-700 mb-2">
              As a Premium User, you have access to exclusive features and
              benefits.
            </Text>
            <Button
              title="Learn More"
              onPress={() =>
                Alert.alert(
                  'Premium Features',
                  'Details about premium features...',
                )
              }
            />
            <Button
              title="Downgrade to Regular User"
              onPress={() =>
                Alert.alert(
                  'Confirm Downgrade',
                  'Are you sure you want to downgrade to Regular USER?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Yes',
                      onPress: () => handleUpgradeRole(RoleEnum.User),
                    },
                  ],
                )
              }
            />
          </View>
        )}

        {/* Testing wash sessions*/}
        <Text className="text-lg font-bold">Wash Sessions History</Text>

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
              <Text>{wash.washType.type} Wash </Text>
              <Text className="text-slate-600 mb-2">
                Paid: {wash.amountPaid} DKK
              </Text>

              <Text className="text-xs text-gray-500">
                {new Date(wash.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}

        <View>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}
