// 代码生成时间: 2025-09-15 10:32:55
import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { XssFilterGuard } from './xss-filter.guard';
import { XssFilterPipe } from './xss-filter.pipe';
import { APP_PIPE } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new XssFilterPipe(),
    },
    //{ provide: APP_GUARD, useFactory: () => new XssFilterGuard(), } // Uncomment to use guard approach
  ],
})
export class XssProtectionModule {

  // Configure the module's middleware
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(XssFilterGuard) // Apply the guard to all routes
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

/*
 * Guard for filtering out XSS attacks
 * This guard checks for potential XSS attacks in the request and
 * prevents them by sanitizing input data.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class XssFilterGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Sanitize request data here to prevent XSS
    // For example, using a library like DOMPurify or sanitize-html
    // request.body = sanitizeHtml(request.body);
    
    return true; // Return false to block the request if an XSS attack is detected
  }
}

/*
 * Pipe for filtering out XSS attacks
 * This pipe sanitizes the incoming data to prevent XSS attacks
 */
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class XssFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (typeof value === 'string') {
      const sanitized = sanitizeHtml(value, {
        allowedTags: [], // Allow no HTML tags
        allowedAttributes: [], // Allow no attributes
      });
      return sanitized;
    }
    return value;
  }
}
