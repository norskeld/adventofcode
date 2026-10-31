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

  for (const [r, line] of input.trim().split('\n').entries()) {
    const row: Cell[] = []

    for (const [c, char] of line.split('').entries()) {
      if (char === '^') {
        start = [r, c]
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
  let [r, c] = start

  const visitedStates: Set<string> = new Set()
  const visitedPositions: Set<string> = new Set()

  visitedPositions.add(`${r}:${c}`)

  while (true) {
    const state = `${r}:${c}:${directionIdx}`

    if (visitedStates.has(state)) {
      return {
        hasLoop: true,
        visitedPositions,
      }
    }

    visitedStates.add(state)

    const [dr, dc] = DIRECTIONS[directionIdx]
    const nr = r + dr
    const nc = c + dc

    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
      return {
        hasLoop: false,
        visitedPositions,
      }
    }

    if (grid[nr][nc] == Cell.Obstacle) {
      directionIdx = (directionIdx + 1) % 4
    } else {
      r = nr
      c = nc

      visitedPositions.add(`${r}:${c}`)
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
  const [sr, sc] = start

  let loopObstaclesCount = 0

  for (const position of visitedPositions) {
    const [or, oc] = position.split(':').map(Number)

    // Cannot place an obstacle directly under the guard's starting position.
    if (or === sr && oc === sc) {
      continue
    }

    // Temporarily place obstacle.
    grid[or][oc] = Cell.Obstacle

    // Check if placed obstacle creates a loop.
    const { hasLoop } = simulate(grid, [sr, sc])

    if (hasLoop) {
      loopObstaclesCount++
    }

    grid[or][oc] = Cell.Empty
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
