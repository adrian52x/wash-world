import { LocationsAPI } from '@/api/LocationsAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Location as WashLocation } from '@/types/types';

export const useLocations = () => {
  // Fetch locations
  const {
    data: locations,
    isLoading: loadingLocations,
    isError: errorLocations,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: () => LocationsAPI.getLocations(),
    retry: 2,
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
    retry: 2,
  });

  return {
    location,
    loadingLocation,
    errorLocation,
  };
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const updateLocation = useMutation({
    mutationFn: ({ locationId, ...data }: { locationId: number } & Partial<WashLocation>) =>
      LocationsAPI.updateLocation(locationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location'] });
    },
  });

  return {
    updateLocation,
  };
};
