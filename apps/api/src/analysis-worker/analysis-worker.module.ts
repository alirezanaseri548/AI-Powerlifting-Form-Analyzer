import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { AnalysisProcessor } from './analysis.processor';

@Module({
  imports: [PrismaModule, QueueModule],
  providers: [AnalysisProcessor],
})
export class AnalysisWorkerModule {}