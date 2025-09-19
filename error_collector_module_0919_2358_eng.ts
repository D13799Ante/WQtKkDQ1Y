// 代码生成时间: 2025-09-19 23:58:01
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './errors.interceptor';
import { ErrorFilter } from './error.filter';
import { ErrorCollectorService } from './error-collector.service';
import { ErrorsController } from './errors.controller';
import { ErrorCollectorMiddleware } from './error-collector.middleware';

@Module({
  imports: [],
  controllers: [ErrorsController],
  providers: [
    Logger,
    ErrorCollectorService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class ErrorCollectorModule implements NestModule {
  constructor(private readonly errorCollectorService: ErrorCollectorService) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ErrorCollectorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

/* ErrorCollectorService is a service responsible for collecting error logs.
 * It provides a method to log errors to a persistent storage or external service. */
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

@Injectable()
export class ErrorCollectorService {
  constructor(private readonly loggerService: LoggerService) {}

  logError(error: any): void {
    // Implement the logic to log error to persistent storage or external service.
    // For now, it just logs the error to the console using the LoggerService.
    this.loggerService.error('Error occurred:', error);
  }
}

/* ErrorCollectorMiddleware is a NestJS middleware that intercepts requests and catches any errors.
 * It uses the ErrorCollectorService to log the errors. */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorCollectorService } from './error-collector.service';

@Injectable()
export class ErrorCollectorMiddleware implements NestMiddleware {
  constructor(private readonly errorCollectorService: ErrorCollectorService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await next();
    } catch (error) {
      this.errorCollectorService.logError(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

/* ErrorFilter is an exception filter that catches exceptions and converts them to user-friendly messages.
 * It also uses the ErrorCollectorService to log the errors. */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCollectorService } from './error-collector.service';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly errorCollectorService: ErrorCollectorService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.errorCollectorService.logError(exception);

    // Convert the exception to a user-friendly message.
    const message = this.isHttpException(exception) ? exception : 'An unexpected error occurred.';

    response.status(500).json({ statusCode: 500, message });
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return (exception instanceof HttpException);
  }
}

/* ErrorsInterceptor is an interceptor that catches errors and converts them to user-friendly messages.
 * It also uses the ErrorCollectorService to log the errors. */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ErrorCollectorService } from './error-collector.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly errorCollectorService: ErrorCollectorService,
              private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        this.errorCollectorService.logError(err);

        // Convert the error to a user-friendly message.
        return Observable.throw('An unexpected error occurred.');
      }));
  }
}

/* ErrorsController is a controller that provides endpoints to handle error-related requests. */
import { Controller, Get } from '@nestjs/common';

@Controller('errors')
export class ErrorsController {
  @Get()
  getErrors(): string {
    // Implement the logic to retrieve and return error logs.
    return 'Error logs';
  }
}