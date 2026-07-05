import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { ANALYSIS_JOB_PROCESS, ANALYSIS_QUEUE } from '../queue/queue.constants';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(ANALYSIS_QUEUE) private readonly analysisQueue: Queue,
  ) {}

  async create(userId: string, dto: CreateAnalysisDto) {
    const analysis = await this.prisma.analysis.create({
      data: {
        userId,
        fileKey: dto.fileKey,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        mimeType: dto.mimeType,
        fileSize: dto.fileSize,
        status: 'PENDING',
      },
    });

    await this.analysisQueue.add(
      ANALYSIS_JOB_PROCESS,
      { analysisId: analysis.id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 50,
        removeOnFail: 100,
      },
    );

    return analysis;
  }

  async findAllForUser(userId: string) {
    return this.prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, id: string) {
    return this.prisma.analysis.findFirst({
      where: { id, userId },
    });
  }
}