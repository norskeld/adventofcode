const enum Cell {
  Empty,
  Wall,
  Box,
  BoxLeft,
  BoxRight,
}

const enum Move {
  Top,
  Right,
  Down,
  Left,
}

type Coord = [
  row: number,
  col: number,
]

interface Document {
  map: Cell[][]
  moves: Move[]
  start: Coord
}

const DIRECTIONS: Coord[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

function parseDocument(input: string, expand: boolean): Document {
  const [mapRaw, movesRaw] = input.trim().split('\n\n')

  let start: Coord = [0, 0]

  const map: Cell[][] = mapRaw
    .split('\n')
    .map((line, row) => {
      if (expand) {
        line = [...line]
          .map((char) => {
            if (char === '#') return '##'
            if (char === 'O') return '[]'
            if (char === '@') return '@.'
            return '..'
          })
          .join('')
      }

      return [...line].map((char, col) => {
        if (char === '@') {
          start = [row, col]
          return Cell.Empty
        }

        if (char === '#') return Cell.Wall
        if (char === 'O') return Cell.Box
        if (char === '[') return Cell.BoxLeft
        if (char === ']') return Cell.BoxRight
        return Cell.Empty
      })
    })

  const moves: Move[] = movesRaw
    .replaceAll('\n', '')
    .split('')
    .map((char) => {
      if (char === '<') return Move.Left
      if (char === '>') return Move.Right
      if (char === '^') return Move.Top
      return Move.Down
    })

  return { map, moves, start }
}

function step(map: Cell[][], robot: Coord, [dr, dc]: Coord): Coord {
  const moving: [Cell, number, number][] = []
  const seen = new Set<string>()
  const stack: Coord[] = [[robot[0] + dr, robot[1] + dc]]

  while (stack.length > 0) {
    const [row, col] = stack.pop()!
    const cell = map[row][col]

    if (cell === Cell.Wall) {
      return robot
    }

    if (cell !== Cell.Box && cell !== Cell.BoxLeft && cell !== Cell.BoxRight) {
      continue
    }

    const key = `${row},${col}`

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    moving.push([cell, row, col])

    if (cell === Cell.BoxLeft) {
      stack.push([row, col + 1])
    } else if (cell === Cell.BoxRight) {
      stack.push([row, col - 1])
    }

    stack.push([row + dr, col + dc])
  }

  for (const [, row, col] of moving) {
    map[row][col] = Cell.Empty
  }

  for (const [cell, row, col] of moving) {
    map[row + dr][col + dc] = cell
  }

  return [robot[0] + dr, robot[1] + dc]
}

function score(map: Cell[][]): number {
  let sum = 0

  for (const [row, cells] of map.entries()) {
    for (const [col, cell] of cells.entries()) {
      if (cell === Cell.Box || cell === Cell.BoxLeft) {
        sum += 100 * row + col
      }
    }
  }

  return sum
}

function solve(document: Document): number {
  let robot: Coord = document.start

  for (const move of document.moves) {
    robot = step(document.map, robot, DIRECTIONS[move])
  }

  return score(document.map)
}

export function one(input: string): number {
  return solve(parseDocument(input, false))
}

export function two(input: string): number {
  return solve(parseDocument(input, true))
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/15/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
