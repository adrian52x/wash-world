import { ExtraFeaturesCard } from '@/components/ExtraFeaturesCard';
import { UpdateUserForm } from '@/components/UpdateUserForm';
import { UserDetailsCard } from '@/components/UserDetailsCard';
import { WashSessionsCard } from '@/components/WashSessionsCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUpdateUser, useUserWashStats } from '@/hooks/useUsers';
import { useWashSessions } from '@/hooks/useWashSessions';
import { fetchUserSession, logout, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RoleEnum } from '@/types/enums';
import { UpdateUser } from '@/types/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, Text, Button, Alert, RefreshControl } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userSession = useAppSelector(selectUserSession);
  const { washSessions, loadingWashSessions, errorWashSessions, refetchWashSessions } = useWashSessions();
  const { updateUser } = useUpdateUser();

  const { washStats, loadingWashStats, errorWashStats, refetchWashStats } = useUserWashStats();
  const paidUserOnly = userSession?.user.role === RoleEnum.PaidUser;
  const normalUserOnly = userSession?.user.role === RoleEnum.User;

  const [refreshing, setRefreshing] = useState(false);
  // Drag-page to refresh functionality
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([dispatch(fetchUserSession({})), refetchWashStats(), refetchWashSessions()]);
    setRefreshing(false);
  };

  // Check if onboarding is needed
  const needsOnboarding =
    !userSession?.user.phoneNumber || !userSession?.user.address || !userSession?.user.licensePlate;

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
          refetchWashStats(), dispatch(fetchUserSession({}));
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
        isPending={updateUser.isPending}
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
        }}
        onSubmit={handleUpdateSubmit}
        showUsername
        onCancel={() => setShowUpdateForm(false)}
        isPending={updateUser.isPending}
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

      <ScrollView
        testID="scroll-view-refresh-control"
        contentContainerClassName="p-4 space-y-2 pb-[100px]"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* User details */}
        {userSession && (
          <UserDetailsCard
            userSession={userSession}
            onUpdateProfile={() => setShowUpdateForm(true)}
            onLogout={handleLogout}
          />
        )}

        {/* Upgrade button */}
        {normalUserOnly && (
          <>
            <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <Button
                title="Upgrade to Paid User"
                color="#10b981"
                onPress={() =>
                  Alert.alert('Confirm Upgrade', 'Are you sure you want to upgrade to Paid USER?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Upgrade',
                      onPress: () => handleUpgradeRole(RoleEnum.PaidUser),
                    },
                  ])
                }
              />
            </View>
          </>
        )}

        {/* Extra features for Paid user*/}
        {paidUserOnly && (
          <ExtraFeaturesCard
            loading={loadingWashStats}
            error={errorWashStats}
            stats={washStats}
            onDowngrade={() =>
              Alert.alert('Confirm Downgrade', 'Are you sure you want to downgrade to Regular USER?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: () => handleUpgradeRole(RoleEnum.User),
                },
              ])
            }
          />
        )}

        {/* Wash sessions*/}
        <WashSessionsCard
          sessions={washSessions ?? []}
          loading={loadingWashSessions}
          error={errorWashSessions}
          onSeeAll={() => router.push('/history/wash')}
        />
      </ScrollView>
    </View>
  );
}
