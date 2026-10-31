type Coord = [
  row: number,
  col: number,
]

interface ParseResult {
  grid: number[][]
  trailheads: Coord[]
}

interface Step {
  currentStep: number
  coord: Coord
}

const DIRECTIONS: Coord[] = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
]

function parseGrid(input: string): ParseResult {
  const grid: number[][] = []
  const trailheads: Coord[] = []

  for (const [r, line] of input.trim().split('\n').entries()) {
    const row: number[] = []

    for (const [c, char] of line.split('').entries()) {
      const height = Number(char)

      if (height === 0) {
        trailheads.push([r, c])
      }

      row.push(height)
    }

    grid.push(row)
  }

  return {
    grid,
    trailheads,
  }
}

function findTrails(grid: number[][], trailhead: Coord): number {
  const rows = grid.length
  const cols = grid[0].length

  let trailsCount = 0

  const visited: Set<string> = new Set()
  const queue: Step[] = [{ currentStep: 0, coord: trailhead }]

  visited.add(`${trailhead[0]}:${trailhead[1]}`)

  while (queue.length > 0) {
    const step = queue.shift()!
    const [r, c] = step.coord

    if (step.currentStep === 9) {
      trailsCount++
      continue
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr
      const nc = c + dc
      const nStep = step.currentStep + 1
      const nKey = `${nr}:${nc}`

      if (
        nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
        grid[nr][nc] !== nStep ||
        visited.has(nKey)
      ) {
        continue
      }

      queue.push({
        currentStep: nStep,
        coord: [nr, nc],
      })

      visited.add(nKey)
    }
  }

  return trailsCount
}

function findAllTrails(grid: number[][], trailhead: Coord): number {
  const rows = grid.length
  const cols = grid[0].length

  let trailsCount = 0

  const queue: Step[] = [{
    currentStep: 0,
    coord: trailhead,
  }]

  while (queue.length > 0) {
    const step = queue.shift()!
    const [r, c] = step.coord

    if (step.currentStep === 9) {
      trailsCount++
      continue
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr
      const nc = c + dc
      const nStep = step.currentStep + 1

      if (
        nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
        grid[nr][nc] !== nStep
      ) {
        continue
      }

      queue.push({
        currentStep: nStep,
        coord: [nr, nc],
      })
    }
  }

  return trailsCount
}

export function one(input: string): number {
  const { grid, trailheads } = parseGrid(input)
  return trailheads.reduce((acc, th) => acc + findTrails(grid, th), 0)
}

export function two(input: string): number {
  const { grid, trailheads } = parseGrid(input)
  return trailheads.reduce((acc, th) => acc + findAllTrails(grid, th), 0)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/10/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
