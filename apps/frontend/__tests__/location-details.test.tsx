import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import LocationDetails from '../app/location/[id]/index';
import * as useLocationsHook from '@/hooks/useLocations';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn() }),
  Stack: { Screen: () => null }
}));

jest.mock('@/components/ui/LoadingSpinner', () => 'LoadingSpinner');
jest.mock('@/components/ui/InclinedButton', () => ({
  InclinedButton: (props: React.PropsWithChildren<unknown>) => props.children
}));
jest.mock('lucide-react-native', () => ({ ChevronRight: () => null, Clock: () => null, MapPin: () => null, Play: () => null }));
jest.mock('@/assets/images/autowash-hall.png', () => '');
jest.mock('@/assets/images/selfwash-hall.png', () => '');
jest.mock('@/hooks/useLocations');

describe('LocationDetails', () => {
  const mockRouter = { push: jest.fn() };
  const mockLocation = {
    locationId: 1,
    name: 'Test Location',
    address: '123 Test St',
    openingHours: '24/7',
    coordinates: { x: '10.123', y: '56.789' },
    autoWashHalls: 2,
    selfWashHalls: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue(mockRouter);
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));
  });

  it('renders location details when data is available', () => {
    jest.spyOn(useLocationsHook, 'useLocationById').mockReturnValue({
      location: mockLocation,
      loadingLocation: false,
      errorLocation: false,
    });

    const { getByText } = render(<LocationDetails />);
    expect(getByText('Test Location')).toBeTruthy();
  });

  it('navigates to wash page when Start wash button is pressed', () => {
    jest.spyOn(useLocationsHook, 'useLocationById').mockReturnValue({
      location: mockLocation,
      loadingLocation: false,
      errorLocation: false,
    });

    const { getByText } = render(<LocationDetails />);
    
    const startWashButton = getByText('Start wash');
    fireEvent.press(startWashButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/location/1/wash');
  });

  it('opens Google Maps when address is pressed', () => {
    jest.spyOn(useLocationsHook, 'useLocationById').mockReturnValue({
      location: mockLocation,
      loadingLocation: false,
      errorLocation: false,
    });

    const { getByText } = render(<LocationDetails />);
    
    const addressButton = getByText('123 Test St');
    fireEvent.press(addressButton);
    
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=56.789,10.123'
    );
  });
});