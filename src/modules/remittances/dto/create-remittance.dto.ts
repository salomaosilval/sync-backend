import { IsInt } from 'class-validator';

export class CreateRemittanceDto {
  @IsInt()
  rawDataId!: number;
}
