import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransformService, TransformResponse } from './transform.service';
import { TransformedData } from '../../../generated/prisma/client';

@Controller('transform')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('raw-data/:rawDataId')
  async transformRawData(
    @Param('rawDataId', ParseIntPipe) rawDataId: number,
  ): Promise<TransformResponse> {
    return this.transformService.transformToEsfinge(rawDataId);
  }

  @Post('raw-data/:rawDataId/retransform')
  async retransformRawData(
    @Param('rawDataId', ParseIntPipe) rawDataId: number,
  ): Promise<TransformResponse> {
    return this.transformService.retransform(rawDataId);
  }

  @Get('raw-data/:rawDataId')
  async getTransformedData(
    @Param('rawDataId', ParseIntPipe) rawDataId: number,
  ): Promise<TransformedData | null> {
    return this.transformService.getTransformedData(rawDataId);
  }

  @Get('raw-data/:rawDataId/latest')
  async getOrCreateTransformation(
    @Param('rawDataId', ParseIntPipe) rawDataId: number,
  ): Promise<TransformedData> {
    return this.transformService.getLatestTransformation(rawDataId);
  }

  @Get()
  async findAll(@Query('rawId') rawId?: string): Promise<TransformedData[]> {
    return this.transformService.findAll({
      rawId: rawId ? parseInt(rawId, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransformedData> {
    return this.transformService.findOne(id);
  }
}
