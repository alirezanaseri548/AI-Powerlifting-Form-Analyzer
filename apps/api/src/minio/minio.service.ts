import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    this.port = Number(this.configService.getOrThrow<string>('MINIO_PORT'));
    this.useSSL = this.parseBoolean(this.configService.get<string>('MINIO_USE_SSL'));
    this.bucket = this.configService.getOrThrow<string>('MINIO_BUCKET');

    this.client = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
      this.logger.log(`Created MinIO bucket: ${this.bucket}`);
    } else {
      this.logger.log(`MinIO bucket exists: ${this.bucket}`);
    }
  }

  async uploadObject(params: {
    objectName: string;
    buffer: Buffer;
    mimeType: string;
  }) {
    await this.client.putObject(
      this.bucket,
      params.objectName,
      params.buffer,
      params.buffer.length,
      {
        'Content-Type': params.mimeType,
      },
    );

    return {
      bucket: this.bucket,
      objectName: params.objectName,
      url: this.getPublicUrl(params.objectName),
    };
  }

  getPublicUrl(objectName: string) {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endpoint}:${this.port}/${this.bucket}/${objectName}`;
  }

  private parseBoolean(value: string | boolean | undefined): boolean {
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
  }
}