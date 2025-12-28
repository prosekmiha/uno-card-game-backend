import { Card } from './card.types'

export interface Player {
  id: string
  name: string
  hand: Card[]
}

export interface GameState {
  id: string
  players: Player[]
  deck: Card[]
  discardPile: Card[]
  currentPlayerIndex: number
  direction: 1 | -1
  started: boolean
  winnerId?: string
}
