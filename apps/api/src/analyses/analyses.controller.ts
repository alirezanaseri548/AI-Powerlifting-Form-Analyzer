import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../common/types/auth-user.type';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@ApiTags('analyses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analysis record from uploaded video metadata' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAnalysisDto) {
    return this.analysesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user analyses' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.analysesService.findAllForUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one analysis by id for current user' })
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.analysesService.findOneForUser(user.userId, id);
  }
}