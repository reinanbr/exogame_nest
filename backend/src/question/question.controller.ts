import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from '../interfaces/game.interface';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  getAllQuestions(): Question[] {
    return this.questionService.getAllQuestions();
  }

  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto): Question {
    return this.questionService.createQuestion(createQuestionDto);
  }

  @Get('random')
  getRandomQuestions(): Question[] {
    return this.questionService.getRandomQuestions();
  }
}
