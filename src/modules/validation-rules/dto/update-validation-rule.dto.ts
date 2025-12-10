import { IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class UpdateValidationRuleDto {
  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsIn([
    'EQUALS',
    'NOT_EQUALS',
    'GREATER_THAN',
    'LESS_THAN',
    'CONTAINS',
    'IN',
    'REGEX',
  ])
  operator?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn(['IMPEDITIVA', 'ALERTA'])
  level?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
