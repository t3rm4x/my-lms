// Registration service

import { setAuthToken, setUser } from '@/utils/auth';
import type { User } from '@/utils/auth';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string; // <-- ADDED THIS FIELD
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

const API_URL = import.meta.env.VITE_API_REGISTER_URL
const API_KEY =  import.meta.env.VITE_API_KEY

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    // 4. REPLACED MOCK: This is the real network request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY // AWS API Gateway uses 'x-api-key' for API keys
      },
      body: JSON.stringify(data)
    });

    // We need to parse the JSON body to read messages, even for errors
    const responseData = await response.json();

    // 5. Handle HTTP errors (like 400, 401, 503)
    if (!response.ok) {
      // Use the error message from your backend's response
      return {
        success: false,
        message: responseData.message || 'Registration failed. Please try again.'
      };
    }

    // 6. Handle successful registration (HTTP 200)
    // Your backend successfully created the user.
    return {
      success: true,
      // We can use a clearer message, since we know the backend doesn't log the user in.
      message: 'Registration successful! You can now log in.'
    };

    // 7. CRITICAL: Note what was REMOVED.
    // We are NOT calling setAuthToken() or setUser() here.
    // See breakdown below.

  } catch (error) {
    console.error('Registration service error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please try again.'
    };
  }
};