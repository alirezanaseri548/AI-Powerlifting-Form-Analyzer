import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ANALYSIS_QUEUE } from '../queue/queue.constants';

@Injectable()
@Processor(ANALYSIS_QUEUE)
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { analysisId } = job.data ?? {};

    if (!analysisId) {
      throw new Error('analysisId is required in job data');
    }

    this.logger.log(`Starting analysis job id=${job.id}, analysisId=${analysisId}`);

    await this.prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'PROCESSING',
        errorMessage: null,
      },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockResult = {
        summary: 'Mock analysis completed successfully',
        overallScore: 0.82,
        symmetryScore: 0.78,
        depthScore: 0.88,
        barPathScore: 0.8,
        phases: [
          { name: 'setup', score: 0.8 },
          { name: 'descent', score: 0.84 },
          { name: 'ascent', score: 0.81 }
        ],
        recommendations: [
          'Keep chest tighter during descent',
          'Improve bar path consistency',
          'Brace harder before initiating movement'
        ],
        processedAt: new Date().toISOString()
      };

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'COMPLETED',
          resultJson: mockResult,
          errorMessage: null,
        },
      });

      this.logger.log(`Completed analysisId=${analysisId}`);
      return { ok: true, analysisId };
    } catch (error: any) {
      this.logger.error(`Failed analysisId=${analysisId}`, error?.stack || error?.message);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'FAILED',
          errorMessage: error?.message ?? 'Unknown worker error',
        },
      });

      throw error;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Worker active job id=${job.id} name=${job.name}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Worker completed job id=${job.id} name=${job.name}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Worker failed job id=${job?.id} name=${job?.name}: ${error?.message}`);
  }
}