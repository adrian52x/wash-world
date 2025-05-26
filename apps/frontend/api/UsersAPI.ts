import { User } from '@/types/auth.types';
import { UpdateUser, WashStats } from '@/types/types';
import { storage } from '@/utils/storage';

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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
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
      throw new Error('Network response was not ok');
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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    //throw new Error('Intentionally throwing an error');
    return data;
  }
}
