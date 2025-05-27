import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { ChevronRight, Clock, MapPin, Play } from 'lucide-react-native';
import autowashHall from '@/assets/images/autowash-hall.png';
import selfwashHall from '@/assets/images/selfwash-hall.png';
import { InclinedButton } from '@/components/ui/InclinedButton';
import { useLocationById } from '@/hooks/useLocations';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppSelector } from '@/redux/hooks';
import { selectUserSession } from '@/redux/authSlice';

export default function LocationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const userSession = useAppSelector(selectUserSession);
  

  const idStr = Array.isArray(id) ? id[0] : id;
  const { location, loadingLocation, errorLocation } = useLocationById(idStr);

  if (!location || errorLocation) {
    return (
      <View className="absolute inset-0 z-50 justify-center items-center bg-white/60">
        <LoadingSpinner />
      </View>
    );
  }

  // Testing createWashSession, washTypeId is hardcoded to 1, but make sure database is seeded with this id
  const handleStartWash = async () => {
    //if (!userSession?.user.licensePlate) return;
    router.push(`/location/${location.locationId}/wash`);
  };

  if (loadingLocation) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 p-6">
      <Stack.Screen
        options={{
          headerTitle: '',
          headerBackTitle: 'Back',
        }}
      />
      <Text className="font-subheader text-accent-gray-60">Wash station</Text>
      <Text className="font-header text-header font-bold mb-4">{location.name}</Text>

      <Text className="font-subheader text-subheader mb-6">General</Text>

      <View className="flex-row border-t border-l border-r border-gray-300 px-2 py-3 w-full bg-white">
        <Clock size={16} />
        <Text className="ml-2">{location.openingHours}</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-between border border-gray-300 px-2 py-3 mb-3 w-full bg-white"
        onPress={() => {
          const url = `https://www.google.com/maps/search/?api=1&query=${Number(location.coordinates.y)},${Number(location.coordinates.x)}`;
          Linking.openURL(url);
        }}
      >
        <View className="flex-row items-center gap-2">
          <MapPin size={16} />
          <Text className="font-button text-green-600"
            numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: 290 }}>
              {location.address}
          </Text>
        </View>
        <ChevronRight size={20} color="#28a626" />
      </TouchableOpacity>

      <Text className="font-subheader text-subheader my-6">About</Text>

      <Text className="font-bodyText text-bodyText">Height: 2.6m</Text>
      <Text className="font-bodyText text-bodyText">Side mirror to side mirror: 2.55m</Text>
      <Text className="font-bodyText text-bodyText">Max. wheel width: 2.15m</Text>

      <View className="flex-row items-center justify-center gap-16 border border-gray-300 px-2 py-3 my-4 w-full bg-white">
        <View className="items-center">
          <Image source={autowashHall} resizeMode="contain" className="h-[100px] w-[100px]" />
          <Text className="font-subheader text-bodyText">{location.autoWashHalls} Auto Wash</Text>
        </View>

        <View className="items-center">
          <Image source={selfwashHall} resizeMode="contain" className="h-[100px] w-[100px]" />
          <Text className="font-subheader text-bodyText">{location.selfWashHalls} Self Wash</Text>
        </View>
      </View>

      {location.autoWashHalls > 0 && (
        <TouchableOpacity
          className='w-[170px] absolute right-[-20px] bottom-24'
          onPress={handleStartWash}
          disabled={!userSession?.user.licensePlate}
        >
          <InclinedButton className='flex-row gap-2' disabled={!userSession?.user.licensePlate}>
            <Play size={20} color="#ffffff" />
            <Text className='text-white font-subheader text-button'>Start wash</Text>
          </InclinedButton>
        </TouchableOpacity>
      )}
    </View>
  );
}
