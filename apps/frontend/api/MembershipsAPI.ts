import { store } from '@/redux/store';

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

    if (!response.ok) {
      throw new Error('Failed to fetch memberships');
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error('Failed to create membership');
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error('Failed to cancel memberships');
    }

    return response.json();
  }
}
