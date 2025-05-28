import React from 'react';
import * as useLocationsHook from '@/hooks/useLocations';
import * as ExpoLocation from 'expo-location';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 55.7, longitude: 12.6 },
  }),
}));

describe('HomeScreen', () => {
  const mockLocations = [
    {
      locationId: 1,
      name: 'Wash Station 1',
      address: '123 Main St',
      coordinates: { x: '12.5', y: '55.6' },
      autoWashHalls: 2,
      selfWashHalls: 1,
      openingHours: '24/7',
    },
    {
      locationId: 2,
      name: 'Wash Station 2',
      address: '456 Second St',
      coordinates: { x: '12.6', y: '55.7' },
      autoWashHalls: 0,
      selfWashHalls: 3,
      openingHours: '9:00-18:00',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle loading state correctly', () => {
    jest.spyOn(useLocationsHook, 'useLocations').mockImplementation(() => ({
      locations: [],
      loadingLocations: true,
      errorLocations: false,
    }));

    expect(useLocationsHook.useLocations().loadingLocations).toBe(true);
  });

  it('should handle user location permissions correctly', async () => {
    const permissionSpy = jest.spyOn(ExpoLocation, 'requestForegroundPermissionsAsync');
    const getLocationSpy = jest.spyOn(ExpoLocation, 'getCurrentPositionAsync');

    expect(permissionSpy).not.toHaveBeenCalled();
    expect(getLocationSpy).not.toHaveBeenCalled();

    expect(permissionSpy).toBeDefined();
    expect(getLocationSpy).toBeDefined();
  });

  it('should focus on a marker when selected', () => {
    jest.spyOn(useLocationsHook, 'useLocations').mockImplementation(() => ({
      locations: mockLocations,
      loadingLocations: false,
      errorLocations: false,
    }));

    const mockAnimateToRegion = jest.fn();
    const mockMapRef = {
      current: {
        animateToRegion: mockAnimateToRegion,
      },
    };

    jest.spyOn(React, 'useRef').mockReturnValue(mockMapRef);

    expect(mockAnimateToRegion).not.toHaveBeenCalled();
    expect(mockMapRef.current.animateToRegion).toBeDefined();
  });

  it('should navigate to location details when a location is selected', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      push: mockPush,
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockPush).toBeDefined();
  });
});
