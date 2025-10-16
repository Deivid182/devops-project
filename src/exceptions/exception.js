export class Exception extends Error {
  statusCode = 500;
  constructor(message = 'Internal server error', statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}