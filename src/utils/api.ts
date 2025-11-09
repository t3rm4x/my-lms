// src/utils/api.ts

export const API_KEY = import.meta.env.VITE_API_KEY?.trim();

// Validate API key format and log status
if (!API_KEY) {
  console.error('API key is not configured. Please check your .env file.');
} else if (API_KEY.length < 20) {
  console.error('API key appears to be malformed (too short)');
} else {
  console.log('API key is configured:', API_KEY.substring(0, 4) + '...');
  console.log('API key length:', API_KEY.length);
}

// Create headers object with proper AWS API Gateway format
export const createApiHeaders = () => {
  if (!API_KEY) {
    console.error('API Key is missing');
    throw new Error('API Key is required');
  }

  // AWS API Gateway specific headers
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  };
};

// Export default headers for compatibility
export const defaultHeaders = createApiHeaders();

// Validate all URLs are properly configured
const validateUrl = (url: string | undefined, name: string) => {
  if (!url) {
    console.error(`${name} URL is not configured in .env file`);
    return undefined;
  }
  return url.trim();
};

export const API_URLS = {
  login: validateUrl(import.meta.env.VITE_API_LOGIN_URL, 'Login'),
  register: validateUrl(import.meta.env.VITE_API_REGISTER_URL, 'Register'),
  verify: validateUrl(import.meta.env.VITE_API_VERIFY_URL, 'Verify'),
  sendVerification: validateUrl(import.meta.env.VITE_API_SEND_URL, 'Send Verification'),
  verifyCode: validateUrl(import.meta.env.VITE_API_VERIFYCODE_URL, 'Verify Code')
};

export async function apiRequest(url: string, options: RequestInit) {
  if (!url) {
    throw new Error('API URL is not configured');
  }

  // Always create fresh headers for each request
  const headers = createApiHeaders();
  
  console.log(`Making API request to: ${url}`, {
    method: options.method,
    url,
    headers: {
      ...headers,
      'x-api-key': '***' // masked for security
    }
  });

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('API request failed:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}