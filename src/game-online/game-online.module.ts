import { Module } from '@nestjs/common';
import { GameOnlineService } from './game-online.service';
import { GameOnlineController } from './game-online.controller';

@Module({
  providers: [GameOnlineService],
  controllers: [GameOnlineController],
})
export class GameOnlineModule {}
