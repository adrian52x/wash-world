import { useLocations } from '@/hooks/useLocations';
import { useUpdateUser } from '@/hooks/useUsers';
import { fetchUserSession, selectUserSession } from '@/redux/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RoleEnum } from '@/types/enums';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, Button, Alert } from 'react-native';

export default function AdminScreen() {
  const { locations } = useLocations();
  const dispatch = useAppDispatch();
  const userSession = useAppSelector(selectUserSession);
  const { updateUser } = useUpdateUser();

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

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView contentContainerClassName="p-4 space-y-4">
        {/* Upgrade to admin */}
        {(userSession?.user.role === RoleEnum.User || userSession?.user.role === RoleEnum.PaidUser) && (
          <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
            <Text className="text-bodyText">Become admin user</Text>

            <Button
              title="Upgrade to Admin"
              onPress={() =>
                Alert.alert('Confirm Upgrade', 'Are you sure you want to upgrade to ADMIN USERE?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Upgrade',
                    onPress: () => handleUpgradeRole(RoleEnum.Admin),
                  },
                ])
              }
            />
          </View>
        )}
        {/* Downgade to regular user */}
        {userSession?.user.role === RoleEnum.Admin && (
          <>
            <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <Button
                title="Downgrade to Regular User"
                onPress={() =>
                  Alert.alert('Confirm Downgrade', 'Are you sure you want to downgrade to regular user?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Downgrade',
                      onPress: () => handleUpgradeRole(RoleEnum.User),
                    },
                  ])
                }
              />
            </View>

            {/* Show locations */}
            <View className="gap-4">
              <Text className="text-basic-black font-subheader text-subheader">Locations management</Text>
              {locations?.map((location) => (
                <Pressable
                  className="bg-white p-4 rounded-lg shadow"
                  key={location.locationId}
                  onPress={() => router.push(`/location/${location.locationId}/edit`)}
                >
                  <Text className="font-button text-button">{location.name}</Text>
                  <Text className="font-bodyText text-caption">{location.address}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
