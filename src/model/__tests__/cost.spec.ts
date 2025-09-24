import { describe, expect, it } from 'vitest'
import { costWithoutPilot } from '../cost.ts'
import { Corvette, Gunship, Snubfighter } from '../model.ts'

describe('Cost without pilot', () => {
  describe('of a Snubfighter', () => {
    it.each([
      [{ speed: 2 }, 5],
      [{ speed: 3 }, 7],
    ])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Snubfighter(options))).toEqual(expected)
    })
  })

  describe('of a Gunship', () => {
    it.each([
      [{ speed: 1 }, 5],
      [{ speed: 2 }, 7],
    ])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Gunship(options))).toEqual(expected)
    })
  })

  describe('of a Corvette', () => {
    it.each([
      [{}, 7],
    ])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Corvette(options))).toBe(expected)
    })
  })
})
