// parseMongoError.js

function parseMongoError(err) {
  if (!err) return null;

  // Duplicate key error
  if (err.code === 11000) {
    const key = err.keyValue && Object.keys(err.keyValue)[0];
    const field = key || "field";
    const message = `${field} already exists`;
    return { status: 409, message, field };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    // collect first message
    const first = Object.values(err.errors || {})[0];
    const message = first ? first.message : err.message;
    return { status: 400, message };
  }

  return null;
}

export default parseMongoError;
