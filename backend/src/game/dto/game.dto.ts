import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsNotEmpty()
  playerName: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  hostName: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class AnswerQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  answer: number;
}
