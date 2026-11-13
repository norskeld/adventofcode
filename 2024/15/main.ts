const enum Cell {
  Empty,
  Wall,
  Box,
  Robot,
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

function parseDocument(input: string): Document {
  const [mapRaw, movesRaw] = input.trim().split('\n\n')

  let start: Coord = [0, 0]

  const map: Cell[][] = mapRaw
    .split('\n')
    .map((line, row) =>
      [...line].map((char, col) => {
        if (char === '@') {
          start = [row, col]
          return Cell.Robot
        }

        if (char === '#') return Cell.Wall
        if (char === 'O') return Cell.Box
        return Cell.Empty
      })
    )

  const moves: Move[] = movesRaw
    .replaceAll('\n', '')
    .split('')
    .flatMap((char) => {
      if (char === '<') return Move.Left
      if (char === '>') return Move.Right
      if (char === '^') return Move.Top
      return Move.Down
    })

  return { map, moves, start }
}

function step(map: Cell[][], [rr, rc]: Coord, [dr, dc]: Coord): Coord {
  const chain: Coord[] = []

  let row = rr + dr
  let col = rc + dc

  while (map[row][col] === Cell.Box) {
    chain.push([row, col])
    row += dr
    col += dc
  }

  if (map[row][col] === Cell.Wall) {
    return [rr, rc]
  }

  for (let index = chain.length - 1; index >= 0; index--) {
    const [boxRow, boxCol] = chain[index]
    map[boxRow + dr][boxCol + dc] = Cell.Box
  }

  map[rr][rc] = Cell.Empty
  map[rr + dr][rc + dc] = Cell.Robot

  return [rr + dr, rc + dc]
}

export function one(input: string): number {
  const document = parseDocument(input)

  let robot: Coord = document.start
  let sum = 0

  for (const move of document.moves) {
    robot = step(document.map, robot, DIRECTIONS[move])
  }

  for (const [row, cells] of document.map.entries()) {
    for (const [col, cell] of cells.entries()) {
      if (cell === Cell.Box) {
        sum += 100 * row + col
      }
    }
  }

  return sum
}

export function two(input: string): number {
  return 0
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/15/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
