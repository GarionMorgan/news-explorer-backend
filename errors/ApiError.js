/* eslint-disable max-classes-per-file */

class ApiError extends Error {
  constructor(status, message) {
    super(message || 'Error');
    this.status = status || 500;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message) {
    super(400, message || 'Bad Request');
  }
}

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(401, message || 'Unauthorized');
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(403, message || 'Forbidden');
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(404, message || 'Not Found');
  }
}

class ConflictError extends ApiError {
  constructor(message) {
    super(409, message || 'Conflict');
  }
}

class InternalServerError extends ApiError {
  constructor(message) {
    super(500, message || 'Internal Server Error');
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};

export default ApiError;
