import { Injectable } from '@nestjs/common';
import { Player } from '../interfaces/game.interface';

@Injectable()
export class PlayerService {
  private players: Map<string, Player> = new Map();

  createPlayer(id: string, name: string, isHost: boolean = false): Player {
    const player: Player = {
      id,
      name,
      score: 0,
      isHost,
    };
    this.players.set(id, player);
    return player;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  updatePlayerScore(id: string, points: number): Player | undefined {
    const player = this.players.get(id);
    if (player) {
      player.score += points;
      this.players.set(id, player);
    }
    return player;
  }

  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }
}
