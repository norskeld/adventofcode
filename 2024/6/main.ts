const enum Cell {
  Empty,
  Obstacle,
  Guard,
}

const enum Direction {
  Up,
  Right,
  Down,
  Left,
}

interface ParseResult {
  grid: Cell[][]
  start: Coord
}

interface SimulationResult {
  hasLoop: boolean
  visitedPositions: Set<string>
}

type Coord = [
  row: number,
  col: number,
]

const DIRECTIONS: Coord[] = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
]

function parseGrid(input: string): ParseResult {
  const grid: Cell[][] = []
  let start: Coord = [0, 0]

  for (const [rIdx, line] of input.trim().split('\n').entries()) {
    const row: Cell[] = []

    for (const [cIdx, char] of line.split('').entries()) {
      if (char === '^') {
        start = [rIdx, cIdx]
        row.push(Cell.Guard)
      } else if (char === '#') {
        row.push(Cell.Obstacle)
      } else {
        row.push(Cell.Empty)
      }
    }

    grid.push(row)
  }

  return {
    grid,
    start,
  }
}

function simulate(grid: Cell[][], start: Coord): SimulationResult {
  const rows = grid.length
  const cols = grid[0].length

  let directionIdx = Direction.Up
  let [sRow, sCol] = start

  const visitedStates: Set<string> = new Set()
  const visitedPositions: Set<string> = new Set()

  visitedPositions.add(`${sRow}:${sCol}`)

  while (true) {
    const state = `${sRow}:${sCol}:${directionIdx}`

    if (visitedStates.has(state)) {
      return {
        hasLoop: true,
        visitedPositions,
      }
    }

    visitedStates.add(state)

    const [dRow, dCol] = DIRECTIONS[directionIdx]
    const nRow = sRow + dRow
    const nCol = sCol + dCol

    if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols) {
      return {
        hasLoop: false,
        visitedPositions,
      }
    }

    if (grid[nRow][nCol] == Cell.Obstacle) {
      directionIdx = (directionIdx + 1) % 4
    } else {
      sRow = nRow
      sCol = nCol

      visitedPositions.add(`${sRow}:${sCol}`)
    }
  }
}

export function one(input: string): number {
  const { grid, start } = parseGrid(input)
  const { visitedPositions } = simulate(grid, start)

  return visitedPositions.size
}

export function two(input: string): number {
  const { grid, start } = parseGrid(input)
  const { visitedPositions } = simulate(grid, start)
  const [sRow, sCol] = start

  let loopObstaclesCount = 0

  for (const position of visitedPositions) {
    const [oRow, oCol] = position.split(':').map(Number)

    // Cannot place an obstacle directly under the guard's starting position.
    if (oRow === sRow && oCol === sCol) {
      continue
    }

    // Temporarily place obstacle.
    grid[oRow][oCol] = Cell.Obstacle

    // Check if placed obstacle creates a loop.
    const { hasLoop } = simulate(grid, [sRow, sCol])

    if (hasLoop) {
      loopObstaclesCount++
    }

    grid[oRow][oCol] = Cell.Empty
  }

  return loopObstaclesCount
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/6/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
