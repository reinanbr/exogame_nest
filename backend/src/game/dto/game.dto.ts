import { IsString, IsNotEmpty } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsNotEmpty()
  playerName: string;
}

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  hostName: string;
}

export class AnswerQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  answer: number;
}
