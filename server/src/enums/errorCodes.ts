enum ErrorCodes {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  EMPTY_API_TOKEN = 'INVALID_AT_E',
  INVALID_API_TOKEN = 'INVALID_AT_I',
  ERROR_API_TOKEN = 'ERROR_AT',
  INVALID_CAPTCHA_TOKEN = 'INVALID_CT',
  EMPTY_CAPTCHA_TOKEN = 'INVALID_CT_E',
  ERROR_GOOGLE_RECAPTCHA = 'ERROR_GRC',
};

export default ErrorCodes;
