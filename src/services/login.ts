// Login service
import { setAuthToken, setUser } from '@/utils/auth';
import type { User } from '@/utils/auth'; // Imports the new, lean User type

/**
 * Defines the data structure required for login.
 * Must match the backend 'login.js' input.
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Defines the backend's raw user response.
 * We'll adapt this to our frontend 'User' type.
 */
interface BackendUser {
  username: string;
  name: string;
  email: string;
  userType: 'student' | 'instructor';
}

/**
 * Defines the service's response.
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Get API URL and Key from Vite environment variables
const API_URL = import.meta.env.VITE_API_LOGIN_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Calls the backend /login endpoint.
 * On success, saves the token and user to localStorage.
 */
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
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

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    // Handle failed login (401, 503, etc.)
    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || 'Login failed. Please check your credentials.'
      };
    }

    // Handle successful login (HTTP 200)
    // Backend response is: { user: { username, name, userType }, token }
    const backendUser: BackendUser = responseData.user;
    const token: string = responseData.token;

    // Adapt the backend response to our frontend User type
    // This is now 1:1, no more "faking" data.
    const user: User = {
      id: backendUser.username,
      name: backendUser.name,
      userType: backendUser.userType,
      email: backendUser.email,
    };
    
    // Set auth state in the browser
    setAuthToken(token);
    setUser(user);
    
    return {
      success: true,
      message: 'Login successful!',
      user,
      token
    };

  } catch (error) {
    console.error('Login service network error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please check your connection and try again.'
    };
  }
};