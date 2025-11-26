// Login service
import { setAuthToken, setUser } from '@/utils/auth';
import { API_URLS, createApiHeaders } from '@/utils/api';
import type { User } from '@/utils/auth'; 

export interface LoginData {
  username: string;
  password: string;
}

/**
 * The raw user object our backend (login.js) sends.
 */
interface BackendUser {
  username: string;
  name: string;
  userType: 'student' | 'instructor';
  email: string;
}

/**
 * The response from our login service.
 * It's now "smarter" and can include an error code.
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  code?: string; // <-- This can be 'EMAIL_NOT_VERIFIED' or 'MFA_CODE_SENT'
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    // Validate API configuration
    if (!API_URLS.login) {
      console.error('Login URL is not configured');
      return {
        success: false,
        message: 'Client configuration error: Login URL is missing'
      };
    }

    // Create the request payload
    const payload = {
      username: data.username.trim(),
      password: data.password
    };

    // Create fresh headers for this request
    const headers = createApiHeaders();
    
    // Log the request (safely)
    console.log('Attempting login:', {
      url: API_URLS.login,
      method: 'POST',
      username: payload.username,
      headers: {
        ...headers,
        'x-api-key': '***' // masked for security
      }
    });

    const response = await fetch(API_URLS.login, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    // --- 1. SMART ERROR HANDLING ---
    // We must try to read the JSON body *even if the response fails*.
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      // Handle cases where the server sends non-JSON (like a 502 Gateway Error)
      console.error("Failed to parse JSON response:", e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    // --- 1. CHECK FOR MFA FLOW FIRST (200 with MFA_CODE_SENT) ---
    if (response.ok && responseData.code === 'MFA_CODE_SENT') {
      return {
        success: false,  // Not fully logged in yet, need MFA
        message: responseData.message,
        code: 'MFA_CODE_SENT'
      };
    }

    // --- 2. HANDLE FAILED LOGIN ---
    if (!response.ok) {
      console.error('Login failed:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      });

      // Handle specific error cases
      if (response.status === 401) {
        if (responseData.code === 'EMAIL_NOT_VERIFIED') {
          return {
            success: false,
            message: responseData.message,
            code: 'EMAIL_NOT_VERIFIED'
          };
        }
        // Check if it's an API key issue
        if (responseData.message?.toLowerCase().includes('api key')) {
          console.error('API Key authentication failed');
          return {
            success: false,
            message: 'Authentication failed. Please contact support.'
          };
        }
      }
      
      return {
        success: false,
        message: responseData.message || 'Login failed. Please check your credentials.'
      };
    }

    // --- 3. COMPLETE LOGIN SUCCESS (200 with user + token) ---
    // This only happens after MFA verification
    const backendUser: BackendUser = responseData.user;
    const token: string = responseData.token;

    // NO MORE "faked" data. This is 1:1 with our honest User type.
    const user: User = {
      id: backendUser.username,
      name: backendUser.name,
      userType: backendUser.userType,
      email: backendUser.email
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