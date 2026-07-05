import { ApiProperty } from '@nestjs/swagger';

export class AnalysisPhaseScoreDto {
  @ApiProperty({ example: 'setup' })
  name!: string;

  @ApiProperty({ example: 0.8 })
  score!: number;
}

export class AnalysisResultDto {
  @ApiProperty({ example: 'Mock analysis completed successfully' })
  summary!: string;

  @ApiProperty({ example: 0.82 })
  overallScore!: number;

  @ApiProperty({ example: 0.78 })
  symmetryScore!: number;

  @ApiProperty({ example: 0.88 })
  depthScore!: number;

  @ApiProperty({ example: 0.8 })
  barPathScore!: number;

  @ApiProperty({ type: [AnalysisPhaseScoreDto] })
  phases!: AnalysisPhaseScoreDto[];

  @ApiProperty({ type: [String] })
  recommendations!: string[];

  @ApiProperty({ example: '2026-07-05T12:00:00.000Z' })
  processedAt!: string;
}