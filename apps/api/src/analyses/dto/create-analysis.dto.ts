import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAnalysisDto {
  @ApiProperty({ example: 'videos/test-video.mp4' })
  @IsString()
  @IsNotEmpty()
  fileKey!: string;

  @ApiProperty({ example: 'http://localhost:9000/powerlifting-videos/videos/test-video.mp4' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiProperty({ example: 'test-video.mp4' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ example: 'video/mp4' })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({ example: 123456 })
  @IsInt()
  @Min(1)
  fileSize!: number;
}