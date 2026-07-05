import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async uploadVideo(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    const maxMb = Number(this.configService.get<string>('MAX_VIDEO_SIZE_MB') ?? '200');
    const maxBytes = maxMb * 1024 * 1024;

    if (file.size > maxBytes) {
      throw new BadRequestException(`File exceeds max size of ${maxMb} MB`);
    }

    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'video/x-matroska',
      'application/octet-stream',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported video type: ${file.mimetype}`);
    }

    const extension = extname(file.originalname) || '.mp4';
    const objectName = `videos/${randomUUID()}${extension}`;

    const uploaded = await this.minioService.uploadObject({
      objectName,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });

    return {
      fileKey: uploaded.objectName,
      fileUrl: uploaded.url,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }
}