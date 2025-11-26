// MFA services for login verification
import { setAuthToken, setUser } from '@/utils/auth';
import { API_URLS, createApiHeaders } from '@/utils/api';
import type { User } from '@/utils/auth';

export interface MfaVerifyData {
  username: string;
  mfaCode: string;
}

export interface MfaResendData {
  username: string;
}

/**
 * Backend user object structure
 */
interface BackendUser {
  username: string;
  name: string;
  userType: 'student' | 'instructor';
  email: string;
}

/**
 * Response from MFA verification
 */
export interface MfaVerifyResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  code?: string;
}

/**
 * Response from MFA resend
 */
export interface MfaResendResponse {
  success: boolean;
  message: string;
  code?: string;
}

/**
 * Verifies the MFA code and completes the login process
 */
export const verifyMfaCode = async (data: MfaVerifyData): Promise<MfaVerifyResponse> => {
  try {
    // Validate API configuration
    if (!API_URLS.mfaVerify) {
      console.error('MFA Verify URL is not configured');
      return {
        success: false,
        message: 'Client configuration error: MFA Verify URL is missing'
      };
    }

    const payload = {
      username: data.username.trim(),
      mfaCode: data.mfaCode.trim()
    };

    const headers = createApiHeaders();

    console.log('Verifying MFA code:', {
      url: API_URLS.mfaVerify,
      username: payload.username
    });

    const response = await fetch(API_URLS.mfaVerify, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    if (!response.ok) {
      console.error('MFA verification failed:', {
        status: response.status,
        data: responseData
      });

      return {
        success: false,
        message: responseData.message || 'MFA verification failed.',
        code: responseData.code
      };
    }

    // Success! Extract user and token
    const backendUser: BackendUser = responseData.user;
    const token: string = responseData.token;

    const user: User = {
      id: backendUser.username,
      name: backendUser.name,
      userType: backendUser.userType,
      email: backendUser.email
    };

    // Set auth state
    setAuthToken(token);
    setUser(user);

    return {
      success: true,
      message: responseData.message || 'Login successful!',
      user,
      token
    };

  } catch (error) {
    console.error('MFA verify service error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please check your connection and try again.'
    };
  }
};

/**
 * Resends the MFA code to user's email
 */
export const resendMfaCode = async (data: MfaResendData): Promise<MfaResendResponse> => {
  try {
    if (!API_URLS.mfaSend) {
      console.error('MFA Send URL is not configured');
      return {
        success: false,
        message: 'Client configuration error: MFA Send URL is missing'
      };
    }

    const payload = {
      username: data.username.trim()
    };

    const headers = createApiHeaders();

    console.log('Resending MFA code:', {
      url: API_URLS.mfaSend,
      username: payload.username
    });

    const response = await fetch(API_URLS.mfaSend, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    if (!response.ok) {
      console.error('MFA resend failed:', {
        status: response.status,
        data: responseData
      });

      return {
        success: false,
        message: responseData.message || 'Failed to resend MFA code.',
        code: responseData.code
      };
    }

    return {
      success: true,
      message: responseData.message || 'MFA code sent successfully!',
      code: responseData.code
    };

  } catch (error) {
    console.error('MFA resend service error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please check your connection and try again.'
    };
  }
};
