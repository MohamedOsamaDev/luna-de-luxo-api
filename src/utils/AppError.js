export class AppError extends Error {
  constructor({ message, code, details }) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
