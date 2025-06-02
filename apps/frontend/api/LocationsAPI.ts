import { Location } from '@/types/types';
import { storage } from '@/utils/storage';
import { APIError } from './errorAPI';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class LocationsAPI {
  static async getLocations(): Promise<Location[]> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/locations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }

  static async getLocationById(id: string): Promise<Location> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/locations/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }

  static async updateLocation(locationId: number, locationData: Partial<Location>): Promise<Location> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/admin/locations/${locationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(locationData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }
}
