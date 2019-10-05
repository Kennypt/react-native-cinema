import helmet from 'helmet';

// const oneYear = 60 * 60 * 24 * 365; // seconds

/**
 * @name security
 * @description Add security middleware
 * @returns {Function} security middleware
 */
export default () =>
  helmet();

/* {
  noSniff: false,
  frameguard: { action: 'deny' },
  hsts: {
    includeSubDomains: false,
    hsts: false,
    maxAge: oneYear,
  },
} */
