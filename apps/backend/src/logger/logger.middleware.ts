import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date();
    const { method, path, baseUrl, originalUrl } = req;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`REQUEST [${startTime.toISOString()}]`);
    console.log(`Endpoint: ${method} ${originalUrl}`);
    console.log(`Path: ${path}`);
    console.log(`Base URL: ${baseUrl}`);

    const originalSend = res.send;
    res.send = function (body) {
      console.log(`Response status: ${res.statusCode}`);
      return originalSend.call(this, body);
    };

    next();
  }
}
