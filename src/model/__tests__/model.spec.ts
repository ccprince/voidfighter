import { describe, expect, it } from 'vitest'
import { Corvette, Gunship, Rating, Snubfighter, Stat } from '../model.ts'

describe('Defense stat', () => {
  it.each([
    { ship: Snubfighter(), expected: new Stat(Rating.D6) },
    { ship: Gunship(), expected: new Stat(Rating.D8) },
    { ship: Corvette(), expected: new Stat(Rating.D10) },
    { ship: Corvette({ upgrades: ['Shields'] }), expected: new Stat(Rating.D10, 1) }
  ])('$ship.shipType -> $expected', ({ ship, expected }) => {
    expect(ship.defense).toEqual(expected)
  })
})

describe('Stat', () => {
  it.each([
    [new Stat(Rating.D8), "2d8"],
    [new Stat(Rating.D10, -1), "2d10-1"],
    [new Stat(Rating.D12, 2), "2d12+2"]
  ])('$1', (stat, expected) => {
    expect(stat.toString()).toEqual(expected)
  })
})

