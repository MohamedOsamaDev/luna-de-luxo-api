export class AppError extends Error {
  constructor({ message, code, details,unhandledError=fasle }) {
    super(message);
    this.code = code;
    this.details = details;
    this.unhandledError = unhandledError;
  }
}
