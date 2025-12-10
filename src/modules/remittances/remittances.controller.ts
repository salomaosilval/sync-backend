import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RemittancesService, RemittanceStats } from './remittances.service';
import {
  TceIntegrationService,
  SendResult,
} from '../tce-integration/tce-integration.service';
import { CreateRemittanceDto } from './dto';
import { Remittance, RemittanceLog } from '../../../generated/prisma/client';

@Controller('remittances')
export class RemittancesController {
  constructor(
    private readonly remittancesService: RemittancesService,
    private readonly tceIntegrationService: TceIntegrationService,
  ) {}

  @Post()
  async create(
    @Body() createRemittanceDto: CreateRemittanceDto,
  ): Promise<Remittance> {
    return this.remittancesService.create(createRemittanceDto);
  }

  @Get('stats')
  async getStats(): Promise<RemittanceStats> {
    return this.remittancesService.getStats();
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('module') module?: string,
    @Query('competency') competency?: string,
    @Query('unitId') unitId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    data: Remittance[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.remittancesService.findAll({
      status,
      module,
      competency,
      unitId: unitId ? parseInt(unitId, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Remittance> {
    return this.remittancesService.findOne(id);
  }

  @Get(':id/logs')
  async getLogs(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RemittanceLog[]> {
    return this.remittancesService.getLogs(id);
  }

  @Post(':id/send')
  async send(@Param('id', ParseIntPipe) id: number): Promise<SendResult> {
    return this.tceIntegrationService.sendRemittance(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<Remittance> {
    return this.remittancesService.cancel(id);
  }

  @Post(':id/retry')
  async retry(@Param('id', ParseIntPipe) id: number): Promise<Remittance> {
    return this.remittancesService.retry(id);
  }
}
