import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import washWorldMarker from '../../assets/icons/w-map-marker.png';
import { CircleX, Navigation as MyLocationIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fakeLocations } from '@/constants/fakeData';

const cphCoordinates = {
    latitude: 55.6761,
    longitude: 12.5683,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function Map() {
    const mapRef = useRef<MapView>(null);
    const [clickedLocationId, setClickedLocationId] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const router = useRouter();

    // Request location permission and get user location & animate map to user location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            mapRef.current?.animateToRegion(
                {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                },
                500
            );
        })();
    }, []);

    // Focus on the marker when it is pressed
    const focusOnMarker = (id: number, latitude: number, longitude: number) => {
        setClickedLocationId(id);
        mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 500);
    };
    
    // Focus on the user location when the button is pressed
    const focusOnUserLocation = () => {
        if (userLocation) {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    };

    const focusedLocation = fakeLocations.find(loc => loc.id === clickedLocationId);

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
        <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
                latitude: userLocation?.latitude ?? cphCoordinates.latitude,
                longitude: userLocation?.longitude ?? cphCoordinates.longitude,
                latitudeDelta: cphCoordinates.latitudeDelta,
                longitudeDelta: cphCoordinates.longitudeDelta,
            }}
            showsUserLocation={true}
        >
            {fakeLocations.map(loc => (
            <Marker
                key={loc.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={loc.title}
                onPress={() => focusOnMarker(loc.id, loc.latitude, loc.longitude)}
            >
                <Image
                source={washWorldMarker}
                style={
                    loc.id === clickedLocationId
                    ? { width: 60, height: 60 }
                    : { width: 40, height: 40 }
                }
                resizeMode="contain"
                />
            </Marker>
            ))}
        </MapView>
        <TouchableOpacity style={styles.locateButton} onPress={focusOnUserLocation}>
            <MyLocationIcon />
        </TouchableOpacity>

        {/* {focusedLocation && (
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>{focusedLocation.title}</Text>
                <Text style={styles.detailsDesc}>{focusedLocation.longitude}</Text>
                <TouchableOpacity onPress={() => setClickedLocationId(null)}>
                    <Text style={styles.closeBtn}>Close</Text>
                </TouchableOpacity>
            </View>
        )}             */}
        {focusedLocation && (
        <View style={styles.detailsBox}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setClickedLocationId(null)}>
                <CircleX />
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>{focusedLocation.title}</Text>
            <Text style={styles.detailsDesc}>{focusedLocation.openingHours}</Text>
            {userLocation && (
            <Text style={styles.detailsDesc}>
                Distance: {getDistanceFromLatLonInKm(
                userLocation.latitude,
                userLocation.longitude,
                focusedLocation.latitude,
                focusedLocation.longitude
                ).toFixed(2)} km
            </Text>
            )}
            <TouchableOpacity onPress={() => router.push(`/location/${focusedLocation.id}`)}>
                <Text style={styles.seeMoreBtn}>See more</Text>
            </TouchableOpacity>
        </View>
        )}


        </View>        
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
    locateButton: {
    position: 'absolute',
    left: 20,
    bottom: 100,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
    detailsBox: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    marginLeft: -100,
    width: 250,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
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
    top: 0,
    right: 0,
    zIndex: 2,
    padding: 4,
},
});

