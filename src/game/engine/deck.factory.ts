import { Card, Color, Value } from './card.types'

const colors: Color[] = ['red', 'green', 'blue', 'yellow']
const values: Value[] = [
  '0','1','2','3','4','5','6','7','8','9',
  'skip','reverse','draw2'
]

export function createDeck(): Card[] {
  const deck: Card[] = []

  for (const color of colors) {
    for (const value of values) {
      deck.push({ color, value })
      if (value !== '0') deck.push({ color, value })
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', value: 'wild' })
    deck.push({ color: 'wild', value: 'wild_draw4' })
  }

  return shuffle(deck)
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}