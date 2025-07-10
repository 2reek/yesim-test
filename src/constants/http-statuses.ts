export const HTTP_STATUS = {
  OK: 200,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
} as const;

export const API_ERRORS = {
  METHOD_NOT_ALLOWED: 'Method not allowed',
  EXTERNAL_API_ERROR: (status: number) => `External API error: ${status}`,
  INVALID_RESPONSE: 'Invalid API response',
} as const;

export const API_MESSAGES = {
  FETCH_ERROR: 'API Error in',
  EXTERNAL_API_ERROR: 'External API error:',
} as const;

export const API_SUCCESS = {
  status: true,
} as const; 