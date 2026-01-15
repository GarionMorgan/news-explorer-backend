import { ApiError as ApiErrorClass } from '../errors/ApiError.js';

// Deprecated compatibility wrapper — prefer importing ApiError subclasses
export default function httpError(status, message) {
  return new ApiErrorClass(status, message);
}
