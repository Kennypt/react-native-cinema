import path from 'path';
import statusCodes from 'http-status-codes';

import config from '../config';
import errorCodesEnum from '../enums/errorCodes';

const DEFAULT_ERROR_MESSAGE = 'Unfortunately we are unable to fulfil your request at this time.';

export const buildErrorResponse = (
  message = DEFAULT_ERROR_MESSAGE,
  devMessage,
  code,
  stack,
  action?
) => ({
  status: 'error',
  code,
  error: message,
  action,
  devError: config.isDebugMode ? devMessage : undefined,
  stack: config.isDebugMode ? stack : undefined,
});

// Make error message cleaner and easier to read
const getErrorStack = err =>
  (err.stack || '')
    .split('\n')
    .map(line => line.trim())
    .map(line => line.split(path.sep).join('/'))
    .map(line =>
      line.replace(
        process
          .cwd()
          .split(path.sep)
          .join('/'),
        '.'
      )
    );

// Handle known errors in a specific way
const handleKnownErrors = (err, res) => {
  return false;
};

// Handle our own internal custom errors
const handleCustomErrors = (err, res) => {
  /*
    If Custom Error then handle it for:
    - expose or not the message to the client;
    - show stack error only in dev mode
    - show private message if in dev mode
  */

  // It means that was thrown from a CustomError
  if (err.custom) {
    let devMessage;
    let message = err.publicMessage || DEFAULT_ERROR_MESSAGE;
    const status = err.status || statusCodes.INTERNAL_SERVER_ERROR;
    const { code = errorCodesEnum.INTERNAL_ERROR } = err;

    if (err.expose) {
      // eslint-disable-next-line prefer-destructuring
      message = err.message;
    } else {
      devMessage = err.message;
    }

    res.status(status).json(buildErrorResponse(message, devMessage, code, getErrorStack(err)));
    return true;
  }
  return false;
};

// Handle unknown errors
const handleGenericErrors = (err, res) => {
  const { message } = err;

  // Generic error message
  res
    .status(statusCodes.INTERNAL_SERVER_ERROR)
    .json(
      buildErrorResponse(
        DEFAULT_ERROR_MESSAGE,
        message,
        err.code || errorCodesEnum.INTERNAL_ERROR,
        getErrorStack(err)
      )
    );

  return true;
};

/**
 * @name errorHandler
 * @description Application Exception Handler
 * @param {Error} err Application Error
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @callback next
 */
// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  console.log('[Error Handler]', err);

  return (
    handleKnownErrors(err, res) || handleCustomErrors(err, res) || handleGenericErrors(err, res)
  );
};
