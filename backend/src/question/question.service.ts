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
      correctAnswerContext: 'Brasília é a capital federal do Brasil desde 1960, quando foi inaugurada para substituir o Rio de Janeiro como sede do governo federal. A cidade foi planejada e construída especificamente para ser a capital.',
      timeLimit: 15,
    },
    {
      id: '2',
      text: 'Quantos planetas existem no sistema solar?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      correctAnswerContext: 'O sistema solar possui 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Plutão foi reclassificado como planeta anão em 2006 pela União Astronômica Internacional.',
      timeLimit: 15,
    },
    {
      id: '3',
      text: 'Qual é o maior oceano do mundo?',
      options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
      correctAnswer: 3,
      correctAnswerContext: 'O Oceano Pacífico é o maior oceano do mundo, cobrindo aproximadamente 46% da superfície oceânica da Terra e cerca de 32% da superfície total do planeta. Estende-se da Ásia e Austrália até as Américas.',
      timeLimit: 15,
    },
    {
      id: '4',
      text: 'Em que ano o homem pisou na Lua pela primeira vez?',
      options: ['1967', '1969', '1971', '1973'],
      correctAnswer: 1,
      correctAnswerContext: 'Neil Armstrong e Buzz Aldrin foram os primeiros seres humanos a pisar na Lua em 20 de julho de 1969, durante a missão Apollo 11 da NASA. Armstrong foi o primeiro a descer, seguido por Aldrin cerca de 20 minutos depois.',
      timeLimit: 20,
    },
    {
      id: '5',
      text: 'Qual é o elemento químico representado pelo símbolo "Au"?',
      options: ['Prata', 'Ouro', 'Alumínio', 'Arsênio'],
      correctAnswer: 1,
      correctAnswerContext: 'O símbolo "Au" representa o ouro na tabela periódica. Este símbolo deriva do termo latino "aurum", que significa ouro. O ouro é um metal precioso com número atômico 79.',
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
    const selectedQuestions = shuffled.slice(0, Math.min(count, this.questions.length));
    
    // Embaralhar as opções de cada pergunta também
    return selectedQuestions.map(question => this.shuffleQuestionOptions(question));
  }

  private shuffleQuestionOptions(question: Question): Question {
    const correctAnswer = question.options[question.correctAnswer];
    const shuffledOptions = [...question.options].sort(() => 0.5 - Math.random());
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: newCorrectIndex,
    };
  }
}
