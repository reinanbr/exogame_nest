import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JoinGameDto, CreateGameDto, AnswerQuestionDto } from './dto/game.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string> = new Map(); // socketId -> playerId

  constructor(private gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('createGame')
  handleCreateGame(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const hostId = client.id;
    const game = this.gameService.createGame(hostId, createGameDto.hostName, createGameDto.avatar);
    
    this.connectedClients.set(client.id, hostId);
    client.join(game.id);
    
    client.emit('gameCreated', { 
      game,
      playerId: hostId 
    });

    return { success: true, gameId: game.id };
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(
    @MessageBody() joinGameDto: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const playerId = client.id;
    const result = this.gameService.joinGame(
      joinGameDto.gameId,
      playerId,
      joinGameDto.playerName,
      joinGameDto.avatar,
    );

    if (!result) {
      client.emit('error', { message: 'A sala não existe ou já foi iniciada', type: 'ROOM_NOT_FOUND' });
      return { success: false };
    }

    this.connectedClients.set(client.id, playerId);
    client.join(joinGameDto.gameId);

    client.emit('gameJoined', {
      game: result.game,
      player: result.player,
    });

    // Notifica outros jogadores
    client.to(joinGameDto.gameId).emit('playerJoined', {
      player: result.player,
      game: result.game,
    });

    return { success: true };
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const hostId = client.id;
    const game = this.gameService.startGame(data.gameId, hostId);

    if (!game) {
      client.emit('error', { message: 'Não foi possível iniciar o jogo' });
      return { success: false };
    }

    const currentQuestion = this.gameService.getCurrentQuestion(game.id);
    
    this.server.to(game.id).emit('gameStarted', {
      game,
      currentQuestion: {
        ...currentQuestion,
        correctAnswer: undefined, // Não enviar resposta correta
      },
    });

    return { success: true };
  }

  @SubscribeMessage('nextQuestion')
  handleNextQuestion(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const hostId = client.id;
    const game = this.gameService.nextQuestion(data.gameId, hostId);

    if (!game) {
      client.emit('error', { message: 'Não foi possível avançar para próxima pergunta' });
      return { success: false };
    }

    if (game.status === 'finished') {
      const leaderboard = this.gameService.getLeaderboard(game.id);
      this.server.to(game.id).emit('gameFinished', {
        game,
        leaderboard,
      });
    } else {
      const currentQuestion = this.gameService.getCurrentQuestion(game.id);
      this.server.to(game.id).emit('nextQuestion', {
        game,
        currentQuestion: {
          ...currentQuestion,
          correctAnswer: undefined, // Não enviar resposta correta
        },
      });
    }

    return { success: true };
  }

  @SubscribeMessage('submitAnswer')
  handleSubmitAnswer(
    @MessageBody() answerDto: AnswerQuestionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const playerId = client.id;
    
    // Buscar gameId através dos rooms do cliente
    const rooms = Array.from(client.rooms);
    const gameId = rooms.find(room => room !== client.id);

    if (!gameId) {
      client.emit('error', { message: 'Jogo não encontrado' });
      return { success: false };
    }

    const success = this.gameService.submitAnswer(
      gameId,
      playerId,
      answerDto.questionId,
      answerDto.answer,
    );

    if (!success) {
      client.emit('error', { message: 'Não foi possível enviar resposta' });
      return { success: false };
    }

    const game = this.gameService.getGame(gameId);
    if (game) {
      const currentQuestion = this.gameService.getCurrentQuestion(gameId);
      if (currentQuestion) {
        const answerStats = this.gameService.getAnswerStats(gameId, currentQuestion.id);
        
        // Notificar todos sobre estatísticas atualizadas
        this.server.to(gameId).emit('answerStatsUpdated', {
          stats: answerStats,
          questionId: answerDto.questionId,
        });
      }
      
      // Notificar o host que um jogador respondeu
      this.server.to(game.hostId).emit('playerAnswered', {
        playerId,
        questionId: answerDto.questionId,
      });
    }

    client.emit('answerSubmitted', { success: true });
    return { success: true };
  }

  @SubscribeMessage('showResults')
  handleShowResults(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game || game.hostId !== client.id) {
      client.emit('error', { message: 'Não autorizado' });
      return { success: false };
    }

    const currentQuestion = this.gameService.getCurrentQuestion(game.id);
    const leaderboard = this.gameService.getLeaderboard(game.id);

    this.server.to(game.id).emit('questionResults', {
      question: currentQuestion,
      leaderboard,
    });

    return { success: true };
  }

  @SubscribeMessage('getAvailableAvatars')
  handleGetAvailableAvatars(@ConnectedSocket() client: Socket) {
    const avatars = this.gameService.getAvailableAvatars();
    client.emit('availableAvatars', { avatars });
    return { success: true, avatars };
  }
}
