import { HttpStatus } from '#common/http-status/index';
import { Exception } from './exception.js';

export class BadRequestException extends Exception {
  constructor(message = 'Bad request', statusCode = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class ConflictException extends Exception {
  constructor(message = 'Conflict', statusCode = HttpStatus.CONFLICT) {
    super(message, statusCode);
  }
}

export class InternalServerErrorException extends Exception {
  constructor(message = 'Internal server error', statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

export class NotFoundException extends Exception {
  constructor(message = 'Not found', statusCode = 404) {
    super(message, statusCode);
  }
}