import { UserSessionData } from '@/types/auth.types';
import { displayRoleUI } from '@/utils';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

interface UserDetailsCardProps {
  userSession: UserSessionData;
  onUpdateProfile: () => void;
  onLogout: () => void;
}

export const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ userSession, onUpdateProfile, onLogout }) => (
  <View className="mb-4 rounded-lg bg-white shadow border border-gray-200 ">
    {/* Top bar with logout button */}
    <View className="flex-row justify-end px-4 pt-4 absolute right-0 top-0 z-10">
      <TouchableOpacity
        onPress={onLogout}
        className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
        accessibilityLabel="Logout"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <LogOut color="#16a34a" size={24} />
      </TouchableOpacity>
    </View>
    <View className="px-6 py-6 flex-row items-center">
      {/* Profile avatar placeholder */}
      <View className="w-16 h-16 rounded-full bg-white justify-center items-center mr-4 shadow">
        <Text className="text-2xl font-bold text-green-600">{userSession.user.username[0]?.toUpperCase() ?? 'U'}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-2xl font-bold">{userSession.user.username}</Text>
        <Text className="text-base">{userSession.user.email}</Text>
      </View>
    </View>
    <View className="px-6 py-5 gap-3">
      <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
        <Text className="text-gray-500">License Plate</Text>
        <Text className="font-semibold text-gray-900">{userSession.user.licensePlate}</Text>
      </View>
      <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
        <Text className="text-gray-500">Phone</Text>
        <Text className="font-semibold text-gray-900">{userSession.user.phoneNumber}</Text>
      </View>
      <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
        <Text className="text-gray-500">Address</Text>
        <Text className="font-semibold text-gray-900">{userSession.user.address}</Text>
      </View>
      <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
        <Text className="text-gray-500">Role</Text>
        <Text className="font-semibold text-gray-900">{displayRoleUI(userSession.user.role)}</Text>
      </View>
      {userSession.userMembership && (
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Membership</Text>
          <Text className="font-bold text-green-600">{userSession.userMembership.membership.type}</Text>
        </View>
      )}
    </View>
    <View className="border-t border-gray-100 px-6 py-4 bg-gray-50">
      <Button title="Update Profile" onPress={onUpdateProfile} color="#10b981" />
    </View>
  </View>
);
