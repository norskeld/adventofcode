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

  for (const [rowIdx, rowRaw] of input.trim().split('\n').entries()) {
    const row: number[] = []

    for (const [colIdx, colRaw] of rowRaw.split('').entries()) {
      const col = Number(colRaw)

      if (col === 0) {
        trailheads.push([rowIdx, colIdx])
      }

      row.push(col)
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
    const [row, col] = step.coord

    if (step.currentStep === 9) {
      trailsCount++
      continue
    }

    for (const [dRow, dCol] of DIRECTIONS) {
      const nRow = row + dRow
      const nCol = col + dCol
      const nStep = step.currentStep + 1
      const nKey = `${nRow}:${nCol}`

      if (
        nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols ||
        grid[nRow][nCol] !== nStep ||
        visited.has(nKey)
      ) {
        continue
      }

      queue.push({
        currentStep: nStep,
        coord: [nRow, nCol],
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
    const [row, col] = step.coord

    if (step.currentStep === 9) {
      trailsCount++
      continue
    }

    for (const [dRow, dCol] of DIRECTIONS) {
      const nRow = row + dRow
      const nCol = col + dCol
      const nStep = step.currentStep + 1

      if (
        nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols ||
        grid[nRow][nCol] !== nStep
      ) {
        continue
      }

      queue.push({
        currentStep: nStep,
        coord: [nRow, nCol],
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
