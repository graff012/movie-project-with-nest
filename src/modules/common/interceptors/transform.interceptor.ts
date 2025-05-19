import { Injectable } from '@nestjs/common';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const statusCode = response.res.statusCode;
    const isFreeResponse = this.reflector.get('isFreeResponse', handler);

    if (!isFreeResponse) {
      return next.handle().pipe(
        map((data) => {
          return {
            status: statusCode,
            ...(typeof data !== 'object' || Array.isArray(data)
              ? { data }
              : data),
            message: 'success',
          };
        }),
      );
    }

    return next.handle();
  }
}
