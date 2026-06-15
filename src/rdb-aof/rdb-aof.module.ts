import { Module } from '@nestjs/common';
import { RdbAofService } from './rdb-aof.service';
import { RdbAofController } from './rdb-aof.controller';

@Module({
  providers: [RdbAofService],
  controllers: [RdbAofController]
})
export class RdbAofModule {}
