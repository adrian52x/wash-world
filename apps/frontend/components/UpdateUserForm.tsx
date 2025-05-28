import React, { useState } from 'react';
import { View, TextInput, Text, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Phone, Home, Car, User, Lock } from 'lucide-react-native';
import { UpdateUser } from '@/types/types';
import LoadingSpinner from './ui/LoadingSpinner';

interface UpdateUserFormProps {
  initialValues: UpdateUser;
  onSubmit: (values: UpdateUser) => void;
  onCancel?: () => void;

  showUsername?: boolean;
  isPending: boolean;
}

export function UpdateUserForm({
  initialValues,
  onSubmit,
  onCancel,
  showUsername = false,
  isPending = false,
}: UpdateUserFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber);
  const [address, setAddress] = useState(initialValues.address);
  const [licensePlate, setLicensePlate] = useState(initialValues.licensePlate);
  const [username, setUsername] = useState(initialValues.username);

  const isUnchanged =
    phoneNumber === initialValues.phoneNumber &&
    address === initialValues.address &&
    licensePlate === initialValues.licensePlate &&
    (!showUsername || username === initialValues.username);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 pt-[100px] items-center p-6 bg-white">
        {/* Loading state  */}
        {isPending && (
          <View className="absolute inset-0 z-50 justify-center items-center bg-white/60">
            <LoadingSpinner />
          </View>
        )}

        {showUsername ? (
          <Text className="text-xl font-bold mb-4">Update Your Profile</Text>
        ) : (
          <Text className="text-xl font-bold mb-4">Complete Your Profile</Text>
        )}

        {showUsername && (
          <>
            <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-6 w-full max-w-xs bg-white">
              <User color="#797777" />
              <TextInput
                className="ml-2 w-full"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </>
        )}

        <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
          <Phone color="#797777" />
          <TextInput
            className="ml-2 w-full"
            keyboardType="phone-pad"
            placeholderTextColor="#9ca3af"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
          <Home color="#797777" />
          <TextInput
            className="ml-2 w-full"
            placeholderTextColor="#9ca3af"
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
          <Car color="#797777" />
          <TextInput
            className="ml-2 w-full"
            autoCapitalize="characters"
            placeholderTextColor="#9ca3af"
            placeholder="License Plate"
            value={licensePlate}
            onChangeText={setLicensePlate}
          />
        </View>

        <Button
          title="Save"
          onPress={() =>
            onSubmit({
              phoneNumber,
              address,
              licensePlate,
              ...(showUsername && { username }), // If showUsername is true, data will include the username property
            })
          }
          disabled={!phoneNumber || !address || !licensePlate || (showUsername && !username) || isUnchanged}
        />
        {onCancel && <Button title="Cancel" color="#888" onPress={onCancel} />}
      </View>
    </TouchableWithoutFeedback>
  );
}
