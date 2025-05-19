import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setToken(token: string) {
    await SecureStore.setItemAsync('token', token); // key value pair
  },
  async getToken() {
    return await SecureStore.getItemAsync('token');
  },
  async removeToken() {
    await SecureStore.deleteItemAsync('token');
  },
};
