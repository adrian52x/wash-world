import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { CircleX, MapPinned } from 'lucide-react-native';
import { InclinedButton } from './ui/InclinedButton';

interface LocationDetailsProps {
  location: {
    title: string;
    openingHours: string;
    latitude: number;
    longitude: number;
  };
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
  onSeeMore
}) =>{
  if (!location) return null;

    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
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
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <CircleX size={20} color="#888" />
        </TouchableOpacity>
        <Text style={styles.detailsTitle}>{location.title}</Text>
        <Text style={styles.detailsDesc}>{location.openingHours}</Text>
        {userLocation && (
            <Text style={styles.detailsDesc}>
            Distance: {getDistanceFromLatLonInKm(
                userLocation.latitude,
                userLocation.longitude,
                location.latitude,
                location.longitude
            ).toFixed(2)} km
            </Text>
        )}
        <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMoreBtn}>See more</Text>
        </TouchableOpacity>

        {/* Google Maps Button */}
        <TouchableOpacity
            style={styles.gmapsButton}
            onPress={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
            Linking.openURL(url);
            }}
        >
            <MapPinned size={28} color="#4285F4" />
        </TouchableOpacity>
        </View>
    );
}


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
  detailsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  detailsDesc: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  seeMoreBtn: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: 6,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  gmapsButton: {
    position: 'absolute',
    right: -36,
    top: '50%',
    marginTop: -20,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
});