import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Image, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import washWorldMarker from '../../assets/icons/w-map-marker.png';
import { Navigation as MyLocationIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fakeLocations } from '@/constants/fakeData';
import MapSearch from '@/components/MapSearch';
import { LocationDetailsBox } from '@/components/LocationDetailsBox';
import { MapFilters } from '@/components/MapFilters';

const cphCoordinates = {
    latitude: 55.6761,
    longitude: 12.5683,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function HomeScreen() {
    const mapRef = useRef<MapView>(null);
    const [clickedLocationId, setClickedLocationId] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [filter, setFilter] = useState<string>('auto'); // maybe use redux for this

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

    // Filter locations based on the selected filter
    const filteredLocations = fakeLocations.filter(loc =>
        filter === 'auto'
            ? loc.autoWashHalls > 0
            : loc.selfWashHalls > 0
    );

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

    const focusedLocation = filteredLocations.find(loc => loc.id === clickedLocationId);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <MapSearch
                    locations={filteredLocations}
                    onSelect={loc => focusOnMarker(loc.id, loc.latitude, loc.longitude)}
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
                    {filteredLocations.map(loc => (
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

                {/* User location button */}
                <TouchableOpacity className="absolute left-2.5 bottom-[100px] bg-green-600 rounded-full p-2 shadow-lg" onPress={focusOnUserLocation}>
                    <MyLocationIcon width={18} height={18} color="white"/>
                </TouchableOpacity>


                {/* Details box */}
                {focusedLocation && (
                    <LocationDetailsBox
                        location={focusedLocation}
                        userLocation={userLocation ?? undefined}
                        onClose={() => setClickedLocationId(null)}
                        onSeeMore={() => router.push(`/location/${focusedLocation.id}`)}
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
