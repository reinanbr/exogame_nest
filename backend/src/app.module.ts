import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { QuestionModule } from './question/question.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [GameModule, QuestionModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
