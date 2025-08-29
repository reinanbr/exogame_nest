import { IsString, IsArray, IsNumber, Min, Max } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @Min(0)
  @Max(3)
  correctAnswer: number;

  @IsNumber()
  @Min(5)
  @Max(60)
  timeLimit: number;
}
