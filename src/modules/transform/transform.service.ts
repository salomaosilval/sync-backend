import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TransformedData, Prisma } from '../../../generated/prisma/client';
import {
  ModuleMapper,
  TransformResult,
  ContratoMapper,
  EmpenhoMapper,
  CompraDiretaMapper,
  GenericMapper,
} from './mappers';

export interface TransformResponse {
  rawDataId: number;
  module: string;
  transformedData: TransformedData;
  result: TransformResult;
}

@Injectable()
export class TransformService {
  private mappers: Map<string, ModuleMapper>;

  constructor(private prisma: PrismaService) {
    this.mappers = new Map<string, ModuleMapper>([
      ['CONTRATO', new ContratoMapper()],
      ['EMPENHO', new EmpenhoMapper()],
      ['COMPRA_DIRETA', new CompraDiretaMapper()],
    ]);
  }

  async transformToEsfinge(rawDataId: number): Promise<TransformResponse> {
    const rawData = await this.prisma.client.rawData.findUnique({
      where: { id: rawDataId },
    });

    if (!rawData) {
      throw new NotFoundException(`RawData com ID ${rawDataId} não encontrado`);
    }

    const mapper = this.getMapper(rawData.module);
    const payload = rawData.payload as Record<string, unknown>;
    const result = mapper.transform(payload);

    const transformedData = await this.prisma.client.transformedData.create({
      data: {
        rawId: rawDataId,
        payload: result.payload as Prisma.InputJsonValue,
      },
    });

    await this.prisma.client.rawData.update({
      where: { id: rawDataId },
      data: { status: 'PROCESSED' },
    });

    return {
      rawDataId,
      module: rawData.module,
      transformedData,
      result,
    };
  }

  async getTransformedData(rawDataId: number): Promise<TransformedData | null> {
    const rawData = await this.prisma.client.rawData.findUnique({
      where: { id: rawDataId },
    });

    if (!rawData) {
      throw new NotFoundException(`RawData com ID ${rawDataId} não encontrado`);
    }

    return this.prisma.client.transformedData.findFirst({
      where: { rawId: rawDataId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLatestTransformation(rawDataId: number): Promise<TransformedData> {
    const existing = await this.getTransformedData(rawDataId);

    if (existing) {
      return existing;
    }

    const response = await this.transformToEsfinge(rawDataId);
    return response.transformedData;
  }

  async retransform(rawDataId: number): Promise<TransformResponse> {
    const rawData = await this.prisma.client.rawData.findUnique({
      where: { id: rawDataId },
    });

    if (!rawData) {
      throw new NotFoundException(`RawData com ID ${rawDataId} não encontrado`);
    }

    await this.prisma.client.transformedData.deleteMany({
      where: { rawId: rawDataId },
    });

    return this.transformToEsfinge(rawDataId);
  }

  async findAll(filters?: { rawId?: number }): Promise<TransformedData[]> {
    return this.prisma.client.transformedData.findMany({
      where: {
        ...(filters?.rawId && { rawId: filters.rawId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<TransformedData> {
    const transformedData = await this.prisma.client.transformedData.findUnique(
      {
        where: { id },
      },
    );

    if (!transformedData) {
      throw new NotFoundException(
        `TransformedData com ID ${id} não encontrado`,
      );
    }

    return transformedData;
  }

  private getMapper(module: string): ModuleMapper {
    const mapper = this.mappers.get(module);
    if (mapper) {
      return mapper;
    }
    return new GenericMapper(module);
  }
}
