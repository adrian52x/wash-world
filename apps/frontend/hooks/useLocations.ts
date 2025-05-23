import { LocationsAPI } from "@/api/LocationsAPI"
import { useQuery } from "@tanstack/react-query"

export const useLocations = () => {
    // Fetch locations
    const { data: locations } = useQuery({
        queryKey: ['locations'],
        queryFn: () => LocationsAPI.getLocations(),
    })

    return {
        locations
    }
}

export const useLocationById = (id: string) => {
    // Fetch location by id
    const { data: location } = useQuery({
        queryKey: ['location', id],
        queryFn: () => LocationsAPI.getLocationById(id),
        enabled: !!id, // Only run the query if id is defined
    })

    return {
        location
    }
}