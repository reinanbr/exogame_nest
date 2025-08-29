import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { QuestionModule } from '../question/question.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [QuestionModule, PlayerModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
