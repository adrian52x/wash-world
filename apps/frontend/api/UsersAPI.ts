import { User } from '@/types/auth.types';
import { UpdateUser, WashStats } from '@/types/types';
import { storage } from '@/utils/storage';
import { APIError } from './errorAPI';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class UsersAPI {
  static async updateUser(userData: UpdateUser): Promise<User> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }

  static async deleteUser(userId: string): Promise<any> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.message || 'Network error', error.statusCode ?? 500);
    }
    return null; // No content to return on delete
  }

  static async getUserStatistics(): Promise<WashStats> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/users/statistics`, {
      method: 'GET',
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
}
