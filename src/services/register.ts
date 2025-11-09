// Registration service
import { resendVerificationCode } from './verify'; // <-- 1. IMPORT THE NEW TOOL

// The interfaces are the same, as they were already correct
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string;
  userType: 'student' | 'instructor';
  instructorCode?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Get API URL and Key from Vite environment variables
const API_URL = import.meta.env.VITE_API_REGISTER_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  if (!API_URL || !API_KEY) {
    console.error("Missing VITE_API_REGISTER_URL or VITE_API_KEY");
    return { success: false, message: "Client-side configuration error." };
  }

  try {
    // --- 2. THIS IS THE REGISTRATION CALL ---
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
      console.error("Failed to parse JSON response:", e);
      responseData = { message: `Server error (Status: ${response.status}). Please try again.` };
    }

    if (!response.ok) {
      // Handles "Username already exists", "Invalid instructor code", etc.
      return {
        success: false,
        message: responseData.message || 'Registration failed.'
      };
    }

    // --- 3. THIS IS THE NEW LOGIC! ---
    // Registration was successful! Now, immediately send the verification email.
    // We use data.username because the backend `register.js` only returns { username: "..." }
    const sendResult = await resendVerificationCode(data.username);

    if (!sendResult.success) {
      // This is an awkward state, but we must report it.
      // The user *was* created, but the email *failed* to send.
      return {
        success: true, // Registration worked
        message: 'Account created, but failed to send verification email. Please try to log in.'
      };
    }

    // --- 4. PERFECT SUCCESS ---
    // The user was created AND the email was sent.
    return {
      success: true,
      message: 'Registration successful! Check your email for a verification code.'
    };

  } catch (error) {
    console.error('Registration service network error:', error);
    return {
      success: false,
      message: 'A network error occurred. Please check your connection and try again.'
    };
  }
};