// Verification service
// NOTE: This file now handles SESSION verification, not email verification.

import { getUser, getAuthToken, setUser, setAuthToken } from '@/utils/auth';
import type { User } from '@/utils/auth';

// 1. SECURITY WARNING: Move this to an environment variable!
// This key is visible to everyone on your website.
const API_URL = import.meta.env.VITE_API_VERIFY_URL
const API_KEY =  import.meta.env.VITE_API_KEY

export interface SessionValidationResponse {
  success: boolean;
  message: string;
  user?: User;
}

/**
 * Validates the user's current token and session with the backend.
 * This should be called when your app loads to check if the user is
 * already logged in.
 */
export const validateSession = async (): Promise<SessionValidationResponse> => {
  const user = getUser(); // Gets user from local storage
  const token = getAuthToken(); // Gets token from local storage

  // 2. If no user or token is stored, there is no session to validate.
  if (!user || !token) {
    return { success: false, message: 'No session found.' };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY // AWS API Gateway uses 'x-api-key'
      },
      // 3. This is the exact request body your backend /verify endpoint expects
      body: JSON.stringify({
        user: { username: user.id }, // Assuming frontend 'user.id' is the 'username'
        token: token
      })
    });

    const responseData = await response.json();

    // 4. Handle invalid/expired token
    if (!response.ok) {
      return { 
        success: false, 
        message: responseData.message || 'Session is invalid or has expired.' 
      };
    }

    // 5. Success! The backend confirmed the token is valid.
    // Your backend returns the token, so we can re-set it.
    setAuthToken(responseData.token);
    setUser(user); // Re-set the user from local storage to confirm auth state

    return {
      success: true,
      message: 'Session verified.',
      user: user
    };

  } catch (error) {
    console.error('Session validation error:', error);
    return { success: false, message: 'A network error occurred.' };
  }
};