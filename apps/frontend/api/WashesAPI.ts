import { InsertWash, WashSession, WashType } from '@/types/types';
import { storage } from '@/utils/storage';
import { APIError } from './errorAPI';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class WashesAPI {
  static async getWashTypes(): Promise<WashType[]> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/washes`, {
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

  static async getUserWashSessions(): Promise<WashSession[]> {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/washes/user`, {
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

  static async createWashSession(washSession: InsertWash) {
    const token = await storage.getToken();
    const response = await fetch(`${API_URL}/washes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(washSession),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }
}
