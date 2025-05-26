import { Location } from '@/types/types';
import { storage } from '@/utils/storage';

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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    //await new Promise(resolve => setTimeout(resolve, 12000));
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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
}
