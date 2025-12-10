import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateValidationRuleDto, UpdateValidationRuleDto } from './dto';

@Injectable()
export class ValidationRulesService {
  constructor(private prisma: PrismaService) {}

  async create(createValidationRuleDto: CreateValidationRuleDto) {
    return this.prisma.client.validationRule.create({
      data: createValidationRuleDto,
    });
  }

  async findAll(module?: string) {
    return this.prisma.client.validationRule.findMany({
      where: module ? { module, active: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const rule = await this.prisma.client.validationRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(
        `Regra de validação com ID ${id} não encontrada`,
      );
    }

    return rule;
  }

  async findByModule(module: string) {
    return this.prisma.client.validationRule.findMany({
      where: { module, active: true },
    });
  }

  async update(id: number, updateValidationRuleDto: UpdateValidationRuleDto) {
    await this.findOne(id);

    return this.prisma.client.validationRule.update({
      where: { id },
      data: updateValidationRuleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.client.validationRule.delete({
      where: { id },
    });
  }
}
