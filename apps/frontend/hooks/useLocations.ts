import { LocationsAPI } from '@/api/LocationsAPI';
import { useQuery } from '@tanstack/react-query';

export const useLocations = () => {
  // Fetch locations
  const {
    data: locations,
    isLoading: loadingLocations,
    isError: errorLocations,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationsAPI.getLocations(),
  });

  return {
    locations,
    loadingLocations,
    errorLocations,
  };
};

export const useLocationById = (id: string) => {
  // Fetch location by id
  const {
    data: location,
    isLoading: loadingLocation,
    isError: errorLocation,
  } = useQuery({
    queryKey: ['location', id],
    queryFn: () => LocationsAPI.getLocationById(id),
    enabled: !!id, // Only run the query if id is defined
  });

  return {
    location,
    loadingLocation,
    errorLocation,
  };
};
