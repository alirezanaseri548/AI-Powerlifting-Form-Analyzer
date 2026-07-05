import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { AnalysesService } from './analyses.service';
import { PrismaService } from '../prisma/prisma.service';
import { ANALYSIS_QUEUE } from '../queue/queue.constants';

describe('AnalysesService', () => {
  let service: AnalysesService;

  const prismaMock = {
    analysis: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const queueMock = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: getQueueToken(ANALYSIS_QUEUE),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<AnalysesService>(AnalysesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});