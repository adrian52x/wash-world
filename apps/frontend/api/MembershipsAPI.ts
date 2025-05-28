import { store } from '@/redux/store';
import { APIError } from './errorAPI';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class MembershipsAPI {
  static async getMemberships() {
    const token = store.getState().auth.token;

    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_URL}/memberships`, {
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

  static async createMembership(membershipId: number) {
    const token = store.getState().auth.token;

    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_URL}/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ membershipId }),
    });
    console.log('API Response:', response.status);

    const data = await response.json();
    if (!response.ok) {
      throw new APIError(data.message || 'Network error', data.statusCode ?? 500);
    }
    return data;
  }

  static async cancelMembership() {
    const token = store.getState().auth.token;

    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_URL}/memberships`, {
      method: 'DELETE',
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
