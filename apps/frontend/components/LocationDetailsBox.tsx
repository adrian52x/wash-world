import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { CircleX, MapPin, MapPinned, Ruler, Clock } from 'lucide-react-native';
import { InclinedButton } from './ui/InclinedButton';
import { Location } from '@/types/types';

interface LocationDetailsProps {
  location: Location;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
  onSeeMore: () => void;
}

export const LocationDetailsBox: React.FC<LocationDetailsProps> = ({ location, userLocation, onClose, onSeeMore }) => {
  if (!location) return null;

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  const distance =
    userLocation &&
    getDistanceFromLatLonInKm(
      userLocation.latitude,
      userLocation.longitude,
      Number(location.coordinates.y),
      Number(location.coordinates.x),
    ).toFixed(2);

  return (
    <View style={styles.detailsBox}>
      {/* Close Button */}
      <TouchableOpacity className="absolute top-2 right-2 z-10" onPress={onClose}>
        <CircleX size={22} color="#888" />
      </TouchableOpacity>

      {/* Name */}
      <Text
        className="font-bold text-lg mb-0.5 text-green-700 text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ maxWidth: 180 }}
      >
        {location.name}
      </Text>

      {/* Address */}
      <View className="flex-row items-center mb-0.5 justify-center gap-1">
        <MapPin size={15} color="#16a34a" />
        <Text
          className="text-xs text-gray-700"
          selectable
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ maxWidth: 200 }}
        >
          {location.address}
        </Text>
      </View>

      {/* Divider */}
      <View className="w-full h-[0.5px] bg-gray-200 my-1" />

      {/* Opening Hours */}
      <View className="flex-row items-center justify-center mb-1 gap-1">
        <Clock size={14} color="#16a34a" />
        <Text className="text-xs text-center text-gray-500">{location.openingHours}</Text>
      </View>

      {/* Distance */}
      {userLocation && (
        <View className="flex-row items-center mb-1 justify-center gap-1">
          <Ruler size={14} color="#16a34a" />
          <Text className="text-xs text-gray-600">
            Distance: <Text className="font-semibold">{distance} km</Text>
          </Text>
        </View>
      )}

      {/* See More Button */}
      <TouchableOpacity onPress={onSeeMore} className="mt-1">
        <InclinedButton>
          <Text className="text-white text-sm font-semibold">See more</Text>
        </InclinedButton>
      </TouchableOpacity>

      {/* Google Maps Button */}
      <TouchableOpacity
        className="absolute right-[-18px] top-1/2 bg-white rounded-full p-1 shadow"
        onPress={() => {
          const url = `https://www.google.com/maps/search/?api=1&query=${Number(
            location.coordinates.y,
          )},${Number(location.coordinates.x)}`;
          Linking.openURL(url);
        }}
      >
        <MapPinned size={22} color="green" />
      </TouchableOpacity>
    </View>
  );
};

// Change to tailwind css later when design is finalized
const styles = StyleSheet.create({
  detailsBox: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    marginLeft: -120,
    width: 240,
    minHeight: 90,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#eee',
  },
});
