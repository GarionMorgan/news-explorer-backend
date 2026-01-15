// parseMongoError.js

function parseMongoError(err) {
  if (!err) return null;

  // Duplicate key error
  if (err.code === 11000) {
    // try to get key name
    const key = err.keyValue
      ? Object.keys(err.keyValue).join(', ')
      : 'duplicate key';
    return { status: 409, message: `Resource conflict: ${key}` };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.message) {
    return { status: 400, message: err.message };
  }

  return null;
}

export default parseMongoError;
