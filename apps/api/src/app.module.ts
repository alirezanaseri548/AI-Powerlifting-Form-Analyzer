import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MinioModule } from './minio/minio.module';
import { UploadsModule } from './uploads/uploads.module';
import { AnalysesModule } from './analyses/analyses.module';
import { AnalysisWorkerModule } from './analysis-worker/analysis-worker.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MinioModule,
    UploadsModule,
    AnalysesModule,
    AnalysisWorkerModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}