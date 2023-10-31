export const errorHandler = (statusCode, message) => {
  const error = new Error(); // Create a new Error instance.
  error.statusCode = statusCode;
  error.message = message;
  return error;
};