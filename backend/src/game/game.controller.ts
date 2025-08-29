import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  getGame(@Param('id') id: string) {
    const game = this.gameService.getGame(id);
    if (!game) {
      return { error: 'Jogo não encontrado' };
    }
    return game;
  }

  @Get(':id/leaderboard')
  getLeaderboard(@Param('id') id: string) {
    return this.gameService.getLeaderboard(id);
  }

  @Get(':id/current-question')
  getCurrentQuestion(@Param('id') id: string) {
    const question = this.gameService.getCurrentQuestion(id);
    if (!question) {
      return { error: 'Pergunta não encontrada' };
    }
    // Remove a resposta correta para não spoilar
    const { correctAnswer, ...questionWithoutAnswer } = question;
    return questionWithoutAnswer;
  }
}
