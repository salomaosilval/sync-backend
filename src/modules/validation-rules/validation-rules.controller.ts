import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ValidationRulesService } from './validation-rules.service';
import { CreateValidationRuleDto, UpdateValidationRuleDto } from './dto';

@Controller('validation-rules')
export class ValidationRulesController {
  constructor(
    private readonly validationRulesService: ValidationRulesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createValidationRuleDto: CreateValidationRuleDto) {
    return this.validationRulesService.create(createValidationRuleDto);
  }

  @Get()
  findAll(@Query('module') module?: string) {
    return this.validationRulesService.findAll(module);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.validationRulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateValidationRuleDto: UpdateValidationRuleDto,
  ) {
    return this.validationRulesService.update(id, updateValidationRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.validationRulesService.remove(id);
  }
}
