import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: 'AI Powerlifting Form Analyzer API',
      status: 'ok',
    };
  }
}