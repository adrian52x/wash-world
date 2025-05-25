import { InsertWash, WashSession, WashType } from "@/types/types";
import { storage } from "@/utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class WashesAPI {

    static async getWashTypes(): Promise<WashType[]> {
        const token = await storage.getToken();
        const response = await fetch(`${API_URL}/washes`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }

    static async getUserWashSessions(): Promise<WashSession[]> { 
        const token = await storage.getToken();
        const response = await fetch(`${API_URL}/washes/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 3000)); // simulate network delay -- to see loading state in UI
        //throw new Error('test error');
        return data;
    }

    static async createWashSession(washSession: InsertWash) {
        const token = await storage.getToken();
        const response = await fetch(`${API_URL}/washes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(washSession),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
}