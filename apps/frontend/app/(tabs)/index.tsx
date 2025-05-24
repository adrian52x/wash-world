import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import washWorldMarker from '../../assets/icons/w-map-marker.png';
import { Navigation as MyLocationIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fakeLocations } from '@/constants/fakeData';
import MapSearch from '@/components/MapSearch';
import { LocationDetailsBox } from '@/components/LocationDetailsBox';
import { MapFilters } from '@/components/MapFilters';
import { useLocations } from '@/hooks/useLocations';
import { Location as LocationType } from '@/types/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const cphCoordinates = {
  latitude: 55.6761,
  longitude: 12.5683,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [clickedLocationId, setClickedLocationId] = useState<number | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [filter, setFilter] = useState<string>('auto'); // maybe use redux for this

  const router = useRouter();

  const { locations, loadingLocations } = useLocations()

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
        500,
      );
    })();
  }, []);

  // Focus on the marker when it is pressed
  const focusOnMarker = (id: number, latitude: number, longitude: number) => {
    setClickedLocationId(id);
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      500,
    );
  };

  // Focus on the user location when the button is pressed
  const focusOnUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500,
      );
    }
  };

  if (loadingLocations) {
  return (
      <LoadingSpinner />
    );
  }

  // Filter locations based on the selected filter
  const filteredLocations: LocationType[] = (locations ?? []).filter((loc: LocationType) =>
    filter === 'auto'
      ? (loc.autoWashHalls ?? 0) > 0  // ?? is used to provide a default value of 0 if autoWashHalls is null or undefined
      : (loc.selfWashHalls ?? 0) > 0,
  );

  const focusedLocation = filteredLocations.find(
    (loc: LocationType) => loc.locationId === clickedLocationId,
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
        <MapSearch
          locations={filteredLocations}
          onSelect={(loc) => focusOnMarker(loc.locationId, Number(loc.coordinates.y), Number(loc.coordinates.x))}
        />
        {/* Filters below the search bar */}
        <MapFilters filter={filter} setFilter={setFilter} />
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
          {/* Markers with locations */}
          {filteredLocations.map((loc: LocationType) => (
            <Marker
              key={loc.locationId}
              coordinate={{ latitude: Number(loc.coordinates.y), longitude: Number(loc.coordinates.x) }}
              title={loc.name}
              onPress={() => focusOnMarker(loc.locationId, Number(loc.coordinates.y), Number(loc.coordinates.x))}
            >
              <Image
                source={washWorldMarker}
                style={
                  loc.locationId === clickedLocationId
                    ? { width: 60, height: 60 }
                    : { width: 40, height: 40 }
                }
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>

        {/* User location button */}
        <TouchableOpacity
          className="absolute left-2.5 bottom-[100px] bg-green-600 rounded-full p-2 shadow-lg"
          onPress={focusOnUserLocation}
        >
          <MyLocationIcon width={18} height={18} color="white" />
        </TouchableOpacity>

        {/* Details box */}
        {focusedLocation && (
          <LocationDetailsBox
            location={focusedLocation}
            userLocation={userLocation ?? undefined}
            onClose={() => setClickedLocationId(null)}
            onSeeMore={() => router.push(`/location/${focusedLocation.locationId}`)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
