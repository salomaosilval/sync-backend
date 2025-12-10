import { Module } from '@nestjs/common';
import { ValidationRulesController } from './validation-rules.controller';
import { ValidationRulesService } from './validation-rules.service';

@Module({
  controllers: [ValidationRulesController],
  providers: [ValidationRulesService],
  exports: [ValidationRulesService],
})
export class ValidationRulesModule {}
