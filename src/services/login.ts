// Login service

import { setAuthToken, setUser } from '@/utils/auth';
import type { User } from '@/utils/auth'; // Assuming this 'User' type matches the mock's shape

// 1. UPDATED: Your backend (login.js) requires 'username', not 'email'.
// Your login form must provide a 'username'.
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// 2. SECURITY WARNING: Move this to an environment variable!
// This key is visible to everyone on your website.
const API_URL = import.meta.env.VITE_API_LOGIN_URL
const API_KEY =  import.meta.env.VITE_API_KEY

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    // 3. REPLACED MOCK: This is the real network request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY // AWS API Gateway uses 'x-api-key'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    // 4. Handle failed login (401, 500, etc.)
    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || 'Login failed. Please check your credentials.'
      };
    }

    // 5. Handle successful login (HTTP 200)
    // The backend's response body is: { user: { username, name }, token }
    const backendUser = responseData.user;
    const token = responseData.token;

    // 6. ADAPTATION: We must convert the backend's simple user object
    // into the 'User' object your frontend (setUser) expects.
    // This is a *guess* based on your original mock.
    const user: User = {
      id: backendUser.username, // Using 'username' as 'id'
      email: '', // Your backend login does not return an email!
      name: backendUser.name,
      verified: true, // We assume the user is verified if they can log in
      createdAt: new Date() // We have to fake this
    };
    
    // 7. Set auth state in the browser
    setAuthToken(token);
    setUser(user);
    
    return {
      success: true,
      message: 'Login successful!',
      user,
      token
    };

  } catch (error) {
    console.error('Login service error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please try again.'
    };
  }
};