import type { UpgradeKeys } from '@/model/model'
import { describe, expect, it } from 'vitest'
import {
  coalesceDuplicateUpgrades,
  expandDuplicateUpgrades,
  splitDuplicateUpgrade,
} from '../helpers'

describe('Coalescing duplicate upgrades', () => {
  it.each([
    { input: [], expected: [] },
    {
      input: ['Agile', 'Targeting Computer'],
      expected: ['Agile', 'Targeting Computer'],
    },
    { input: ['Enhanced Turret'], expected: ['Enhanced Turret'] },
    {
      input: ['Enhanced Turret', 'Enhanced Turret'],
      expected: ['Enhanced Turret x2'],
    },
    {
      input: ['Enhanced Turret', 'Enhanced Turret', 'Enhanced Turret'],
      expected: ['Enhanced Turret x3'],
    },
    {
      input: ['Agile', 'Enhanced Turret', 'Enhanced Turret', 'Fast'],
      expected: ['Agile', 'Enhanced Turret x2', 'Fast'],
    },
  ])('$input -> $expected', ({ input, expected }) => {
    expect(coalesceDuplicateUpgrades(input as UpgradeKeys[])).toEqual(expected)
  })
})

describe('Expanding duplicate upgrades', () => {
  it.each([
    { input: [], expected: [] },
    {
      input: ['Agile', 'Enhanced Turret'],
      expected: ['Agile', 'Enhanced Turret'],
    },
    {
      input: ['Enhanced Turret x2'],
      expected: ['Enhanced Turret', 'Enhanced Turret'],
    },
    {
      input: ['Agile', 'Enhanced Turret x2', 'Tailgunner'],
      expected: ['Agile', 'Enhanced Turret', 'Enhanced Turret', 'Tailgunner'],
    },
  ])('$input -> $expected', ({ input, expected }) => {
    expect(expandDuplicateUpgrades(input)).toEqual(expected)
  })
})

describe('Splitting duplicate upgrades', () => {
  it.each([
    {
      input: 'Enhanced Turret',
      expected: { upgrade: 'Enhanced Turret', count: 1 },
    },
    {
      input: 'Enhanced Turret x2',
      expected: { upgrade: 'Enhanced Turret', count: 2 },
    },
    {
      input: 'Enhanced Turret X2',
      expected: { upgrade: 'Enhanced Turret', count: 2 },
    },
    {
      input: 'Enhanced Turret x999',
      expected: { upgrade: 'Enhanced Turret', count: 999 },
    },
    { input: 'Kitt 9000', expected: { upgrade: 'Kitt 9000', count: 1 } },
  ])('$0 -> $1', ({ input, expected }) => {
    expect(splitDuplicateUpgrade(input)).toEqual(expected)
  })
})
