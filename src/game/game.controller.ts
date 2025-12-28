import { Controller, Post, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(':id')
  create(@Param('id') id: string) {
    const game = this.gameService.createGame(id)
    return game.getState()
  }
}