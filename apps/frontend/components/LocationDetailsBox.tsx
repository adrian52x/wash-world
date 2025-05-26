import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { CircleX, MapPinned } from 'lucide-react-native';
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

export const LocationDetailsBox: React.FC<LocationDetailsProps> = ({
  location,
  userLocation,
  onClose,
  onSeeMore,
}) => {
  if (!location) return null;

  function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  return (
    <View style={styles.detailsBox}>
      <TouchableOpacity className="absolute top-2 right-2" onPress={onClose}>
        <CircleX size={20} color="#888" />
      </TouchableOpacity>
      <Text className="font-bold text-lg mb-1">{location.name}</Text>
      <Text className="text-[13px] mb-2 text-center">
        {location.openingHours}
      </Text>
      {userLocation && (
        <Text className="text-[13px] mb-2 text-center">
          Distance:{' '}
          {getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            Number(location.coordinates.y),
            Number(location.coordinates.x),
          ).toFixed(2)}{' '}
          km
        </Text>
      )}
      <TouchableOpacity onPress={onSeeMore} className="flex-row items-center">
        <InclinedButton>
          <Text className="text-white">See more</Text>
        </InclinedButton>
      </TouchableOpacity>

      {/* Google Maps Button */}
      <TouchableOpacity
        className="absolute right-[-22px] top-1/2 bg-white rounded-full p-2  "
        onPress={() => {
          const url = `https://www.google.com/maps/search/?api=1&query=${Number(location.coordinates.y)},${Number(location.coordinates.x)}`;
          Linking.openURL(url);
        }}
      >
        <MapPinned size={28} color="green" />
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
    marginLeft: -125,
    width: 275,
    minHeight: 120,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#eee',
  },
});
