import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponseObject {
  message?: string;
  error?: string;
  statusCode?: number;
}

function isExceptionResponseObject(
  value: unknown,
): value is ExceptionResponseObject {
  return typeof value === 'object' && value !== null;
}

function extractMessage(response: string | ExceptionResponseObject): string {
  if (typeof response === 'string') {
    return response;
  }
  return response.message || response.error || 'Unknown error';
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message = extractMessage(
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : isExceptionResponseObject(exceptionResponse)
          ? exceptionResponse
          : { message: 'Internal server error' },
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(isExceptionResponseObject(exceptionResponse)
        ? { details: exceptionResponse }
        : {}),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json(errorResponse);
  }
}
