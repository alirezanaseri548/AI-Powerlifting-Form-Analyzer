import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  getReadiness() {
    return {
      status: 'ready',
      checks: {
        api: true,
      },
      timestamp: new Date().toISOString(),
    };
  }
}