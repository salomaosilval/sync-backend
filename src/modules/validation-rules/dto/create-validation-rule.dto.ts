import { IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class CreateValidationRuleDto {
  @IsString()
  module!: string;

  @IsString()
  field!: string;

  @IsIn([
    'EQUALS',
    'NOT_EQUALS',
    'GREATER_THAN',
    'LESS_THAN',
    'CONTAINS',
    'IN',
    'REGEX',
  ])
  operator!: string;

  @IsString()
  value!: string;

  @IsIn(['IMPEDITIVA', 'ALERTA'])
  level!: string;

  @IsString()
  code!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
