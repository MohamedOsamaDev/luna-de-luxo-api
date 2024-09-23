export class AppError extends Error {
  constructor({ message, code, details, unhandledError = false }) {
    super(message);
    this.code = code;
    this.details = details;
    this.unhandledError = unhandledError;
  }
}
