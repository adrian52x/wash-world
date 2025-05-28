export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'Wash-World API Error';
    this.statusCode = statusCode;
  }
}