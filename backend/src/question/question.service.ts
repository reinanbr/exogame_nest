import { Injectable } from '@nestjs/common';
import { Question } from '../interfaces/game.interface';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  private questions: Question[] = [
    {
      id: '1',
      text: 'Qual é a capital do Brasil?',
      options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      correctAnswer: 2,
      timeLimit: 15,
    },
    {
      id: '2',
      text: 'Quantos planetas existem no sistema solar?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: '3',
      text: 'Qual é o maior oceano do mundo?',
      options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
      correctAnswer: 3,
      timeLimit: 15,
    },
    {
      id: '4',
      text: 'Em que ano o homem pisou na Lua pela primeira vez?',
      options: ['1967', '1969', '1971', '1973'],
      correctAnswer: 1,
      timeLimit: 20,
    },
    {
      id: '5',
      text: 'Qual é o elemento químico representado pelo símbolo "Au"?',
      options: ['Prata', 'Ouro', 'Alumínio', 'Arsênio'],
      correctAnswer: 1,
      timeLimit: 15,
    },
  ];

  getAllQuestions(): Question[] {
    return this.questions;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  createQuestion(createQuestionDto: CreateQuestionDto): Question {
    const newQuestion: Question = {
      id: (this.questions.length + 1).toString(),
      ...createQuestionDto,
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  getRandomQuestions(count: number = 5): Question[] {
    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, this.questions.length));
  }
}
