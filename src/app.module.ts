import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameOnlineModule } from './game-online/game-online.module';
import { RedisModule } from './redis/redis.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { RedisAdvanceModule } from './redis-advance/redis-advance.module';
import { RdbAofModule } from './rdb-aof/rdb-aof.module';

@Module({
  imports: [GameOnlineModule, RedisModule, ECommerceModule, RedisAdvanceModule, RdbAofModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
