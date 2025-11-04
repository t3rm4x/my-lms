// Registration service
import type { User } from '@/utils/auth';

/**
 * Defines the data structure required for registration.
 * Must match the backend 'register.js' input.
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string;
  userType: 'student' | 'instructor';
  instructorCode?: string;
}

/**
 * Defines the service's response.
 * The backend only returns a success/error message.
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Get API URL and Key from Vite environment variables
const API_URL = import.meta.env.VITE_API_REGISTER_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Calls the backend /register endpoint.
 * This function does NOT log the user in.
 */
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  if (!API_URL || !API_KEY) {
    return { success: false, message: "Client-side configuration error. API key or URL is missing." };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(data)
    });

    // Try to parse the JSON body, even on errors
    let responseData = { message: 'Registration failed. Please try again.' };
    try {
      responseData = await response.json();
    } catch (e) {
      // This catches 502 Bad Gateway errors that return HTML
      console.error('Failed to parse JSON response:', e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    if (!response.ok) {
      // Use the error message from the backend's JSON response
      return {
        success: false,
        message: responseData.message 
      };
    }

    // Success: Backend returned 200
    // The backend only returns { username: "..." }
    return {
      success: true,
      message: 'Registration successful! You can now log in.'
    };

  } catch (error) {
    console.error('Registration service network error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please check your connection and try again.'
    };
  }
};