// src/services/verify.ts
import { API_URLS, createApiHeaders } from '@/utils/api';

export interface VerifyResponse {
  success: boolean;
  message: string;
}

export const verifyEmailCode = async (
  username: string | undefined,
  code: string
): Promise<VerifyResponse> => {
  // Input validation
  if (!username || username.trim() === '') { 
    return { 
      success: false, 
      message: "Client Error: User identifier is missing. Please log in or register again." 
    };
  }
  
  if (code.length !== 6) {
    return { 
      success: false, 
      message: "Verification code must be 6 digits." 
    };
  }

  try {
    const headers = createApiHeaders();
    const response = await fetch(API_URLS.verifyCode, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        username: username.trim(), 
        otp: code 
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || 'Verification failed. Check the code and try again.'
      };
    }

    return { 
      success: true, 
      message: 'Email successfully verified! You can now log in.' 
    };

  } catch (error) {
    console.error('Verify service network error:', error);
    return { 
      success: false, 
      message: 'A network error occurred.' 
    };
  }
};

export const resendVerificationCode = async (
  username: string | undefined
): Promise<VerifyResponse> => {
  // Enhanced input validation with logging
  if (!username) {
    console.error('Username is undefined');
    return { 
      success: false, 
      message: "Client Error: User identifier is missing. Cannot resend code." 
    };
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername === '') {
    console.error('Username is empty after trimming');
    return { 
      success: false, 
      message: "Client Error: Username cannot be empty. Cannot resend code." 
    };
  }
  
  if (!API_URLS.sendVerification) {
    console.error('Send verification URL is not configured');
    return {
      success: false,
      message: "Server configuration error. Please contact support."
    };
  }
  
  try {
    const requestBody = { username: trimmedUsername };
    
    // Even more detailed request logging
    console.log('Sending verification request:', {
      method: 'POST',
      url: API_URLS.sendVerification,
      body: requestBody,
      bodyString: JSON.stringify({ username: trimmedUsername }),
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '***' // masked for security
      }
    });
    
    // Make the request with fresh headers
    const headers = createApiHeaders();
    console.log('Request headers:', {
      ...headers,
      'x-api-key': '***' // Mask API key in logs
    });

    // Construct the request body with explicit content
    const requestPayload = {
      username: trimmedUsername.toString() // Ensure it's a string
    };
    
    console.log('Request payload object:', requestPayload);
    const stringifiedPayload = JSON.stringify(requestPayload);
    console.log('Stringified payload:', stringifiedPayload);
    
    const response = await fetch(API_URLS.sendVerification, { 
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'  // Ensure content-type is explicitly set
      },
      body: stringifiedPayload
    });

    const responseData = await response.json();
    
    // Log the complete response for debugging
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      requestBody: { username: trimmedUsername }
    });

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || 'Failed to resend code. Please try again.'
      };
    }

    return { success: true, message: 'Verification code sent successfully!' };

  } catch (error) {
    console.error('Resend service network error:', error);
    return { success: false, message: 'A network error occurred. Please check your connection.' };
  }
};