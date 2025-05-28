import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useLocationById, useUpdateLocation } from '@/hooks/useLocations';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react-native';

export default function EditLocation() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const idStr = Array.isArray(id) ? id[0] : id;
  const { location, loadingLocation } = useLocationById(idStr);
  const { updateLocation } = useUpdateLocation();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    openingHours: '',
    autoWashHalls: '0',
    selfWashHalls: '0',
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        address: location.address,
        openingHours: location.openingHours,
        autoWashHalls: (location.autoWashHalls ?? 0).toString(),
        selfWashHalls: (location.selfWashHalls ?? 0).toString(),
      });
    }
  }, [location]);

  if (loadingLocation || !location) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async () => {
    try {
      const updatedData = {
        locationId: location.locationId,
        name: formData.name,
        address: formData.address,
        openingHours: formData.openingHours,
        autoWashHalls: parseInt(formData.autoWashHalls),
        selfWashHalls: parseInt(formData.selfWashHalls),
      };

      await updateLocation.mutateAsync(updatedData);
      router.back();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 pt-[50px] items-center bg-white">
        <Stack.Screen
          options={{
            headerTitle: 'Edit Location',
            headerBackTitle: 'Back',
          }}
        />

        <Text className="text-xl font-bold mb-4">Edit Location Details</Text>

        <View>
          <Text className="text-xs text-gray-500 mb-1">Name</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
            <MapPin color="#797777" />
            <TextInput
              className="ml-2 w-full"
              placeholderTextColor="#9ca3af"
              placeholder="Location Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
        </View>

        <View>
          <Text className="text-xs text-gray-500 mb-1">Address</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
            <MapPin color="#797777" />
            <TextInput
              className="ml-2 w-full"
              placeholderTextColor="#9ca3af"
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>
        </View>

        <View>
          <Text className="text-xs text-gray-500 mb-1">Opening hours</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
            <Clock color="#797777" />
            <TextInput
              className="ml-2 w-full"
              placeholderTextColor="#9ca3af"
              placeholder="Opening Hours"
              value={formData.openingHours}
              onChangeText={(text) => setFormData({ ...formData, openingHours: text })}
            />
          </View>
        </View>

        <View>
          <Text className="text-xs text-gray-500 mb-1">Auto wash halls</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
            <Clock color="#797777" />
            <TextInput
              className="ml-2 w-full"
              placeholderTextColor="#9ca3af"
              placeholder="Auto wash halls"
              value={formData.autoWashHalls}
              onChangeText={(text) => setFormData({ ...formData, autoWashHalls: text.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View>
          <Text className="text-xs text-gray-500 mb-1">Self wash halls</Text>
          <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
            <Clock color="#797777" />
            <TextInput
              className="ml-2 w-full"
              placeholderTextColor="#9ca3af"
              placeholder="Self wash halls"
              value={formData.selfWashHalls}
              onChangeText={(text) => setFormData({ ...formData, selfWashHalls: text.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View className="w-full max-w-xs space-y-2">
          <Button title="Save Changes" onPress={handleSubmit} />
          <Button title="Cancel" onPress={() => router.back()} color="#888" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
