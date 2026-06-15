import { Module } from '@nestjs/common';
import { RedisAdvanceService } from './redis-advance.service';
import { RedisAdvanceController } from './redis-advance.controller';

@Module({
  providers: [RedisAdvanceService],
  controllers: [RedisAdvanceController]
})
export class RedisAdvanceModule {}
