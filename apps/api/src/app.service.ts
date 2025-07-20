import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Transparent Transaction Ledger API is running!';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Transparent Transaction Ledger API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected', // TODO: Add actual database health check
      blockchain: 'connected', // TODO: Add actual blockchain health check
    };
  }
}
