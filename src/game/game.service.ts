import { Injectable } from '@nestjs/common';
import { UnoEngine } from './engine/uno.engine';

@Injectable()
export class GameService {
  private games = new Map<string, UnoEngine>();

  createGame(id: string) {
    const engine = new UnoEngine(id)
    this.games.set(id, engine)
    return engine
  }

  getGame(id: string) {
    return this.games.get(id)
  }
}
