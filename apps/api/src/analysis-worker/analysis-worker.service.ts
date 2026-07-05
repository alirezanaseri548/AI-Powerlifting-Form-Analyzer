import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnalysisWorkerService {
  private readonly logger = new Logger(AnalysisWorkerService.name);

  async processPendingAnalysis(analysisId: string) {
    this.logger.log(`Mock processing analysis: ${analysisId}`);

    return {
      analysisId,
      status: 'PROCESSED_MOCK',
      result: {
        message: 'Mock worker result created successfully',
      },
    };
  }
}
