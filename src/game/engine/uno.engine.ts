import { GameState, Player } from './game.types'
import { Card, Color } from './card.types'
import { createDeck } from './deck.factory'

export class UnoEngine {
  private state: GameState

  constructor(gameId: string) {
    this.state = {
      id: gameId,
      players: [],
      deck: [],
      discardPile: [],
      currentPlayerIndex: 0,
      direction: 1,
      started: false,
    }
  }

  // ====== PUBLIC API ======

  getState(): GameState {
    return structuredClone(this.state)
  }

  addPlayer(player: Player) {
    if (this.state.started) throw new Error('Game already started')
    this.state.players.push({ ...player, hand: [] })
  }

  startGame() {
    if (this.state.players.length < 2) {
      throw new Error('At least 2 players required')
    }

    this.state.deck = createDeck()

    for (const p of this.state.players) {
      p.hand = this.draw(7)
    }

    // first card must not be wild
    let first: Card
    do {
      first = this.state.deck.pop()!
    } while (first.color === 'wild')

    this.state.discardPile.push(first)
    this.state.started = true
  }

  playCard(playerId: string, cardIndex: number, chosenColor?: Color) {
    this.assertGameStarted()

    const player = this.getCurrentPlayer()
    if (player.id !== playerId) throw new Error('Not your turn')

    const card = player.hand[cardIndex]
    if (!card) throw new Error('Invalid card index')
    if (!this.isValidMove(card)) throw new Error('Invalid move')

    player.hand.splice(cardIndex, 1)

    if (card.color === 'wild') {
      if (!chosenColor || chosenColor === 'wild') {
        throw new Error('Must choose a color')
      }
      card.color = chosenColor
    }

    this.state.discardPile.push(card)
    this.applyCardEffect(card)

    if (player.hand.length === 0) {
      this.state.winnerId = player.id
      return
    }

    this.nextTurn()
  }

  drawCard(playerId: string) {
    this.assertGameStarted()

    const player = this.getCurrentPlayer()
    if (player.id !== playerId) throw new Error('Not your turn')

    player.hand.push(...this.draw(1))
    this.nextTurn()
  }

  // ====== INTERNAL LOGIC ======

  private isValidMove(card: Card): boolean {
    const top = this.topCard()
    return (
      card.color === top.color ||
      card.value === top.value ||
      card.color === 'wild'
    )
  }

  private applyCardEffect(card: Card) {
    if (card.value === 'reverse') {
      this.state.direction *= -1
    }

    if (card.value === 'skip') {
      this.nextTurn()
    }

    if (card.value === 'draw2') {
      const next = this.getNextPlayer()
      next.hand.push(...this.draw(2))
      this.nextTurn()
    }

    if (card.value === 'wild_draw4') {
      const next = this.getNextPlayer()
      next.hand.push(...this.draw(4))
      this.nextTurn()
    }
  }

  private nextTurn() {
    const len = this.state.players.length
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + this.state.direction + len) % len
  }

  private getCurrentPlayer(): Player {
    return this.state.players[this.state.currentPlayerIndex]
  }

  private getNextPlayer(): Player {
    const len = this.state.players.length
    const idx =
      (this.state.currentPlayerIndex + this.state.direction + len) % len
    return this.state.players[idx]
  }

  private topCard(): Card {
    return this.state.discardPile[this.state.discardPile.length - 1]
  }

  private draw(count: number): Card[] {
    if (this.state.deck.length < count) {
      this.reshuffle()
    }
    return this.state.deck.splice(0, count)
  }

  private reshuffle() {
    const top = this.state.discardPile.pop()!
    this.state.deck = createDeck()
    this.state.discardPile = [top]
  }

  private assertGameStarted() {
    if (!this.state.started) throw new Error('Game not started')
  }
}