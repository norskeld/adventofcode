const enum Cell {
  Roll,
  Dot,
}

type Coord = [
  row: number,
  col: number,
]

/** All 8 directions: cardinal (N/S/E/W) and diagonal. */
const DIRECTIONS: Coord[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
  [-1, -1],
]

function parseGrid(input: string): Cell[][] {
  const grid: Cell[][] = []

  for (const [r, line] of input.trim().split('\n').entries()) {
    const row: Cell[] = []

    for (const [c, char] of line.split('').entries()) {
      row.push(char === '@' ? Cell.Roll : Cell.Dot)
    }

    grid.push(row)
  }

  return grid
}

function findAccessibleRollCoords(grid: Cell[][]): Coord[] {
  const rows = grid.length
  const cols = grid[0].length
  const accessibleRollCoords: Coord[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c]

      // Only process roll cells, skip empty dots.
      if (cell === Cell.Roll) {
        let neighbors = 0

        // Check all 8 adjacent cells to count neighboring rolls.
        for (const [dr, dc] of DIRECTIONS) {
          const nr = r + dr
          const nc = c + dc

          // Skip neighbors outside grid bounds.
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue
          }

          if (grid[nr][nc] === Cell.Roll) {
            neighbors++
          }
        }

        if (neighbors < 4) {
          accessibleRollCoords.push([r, c])
        }
      }
    }
  }

  return accessibleRollCoords
}

export function one(input: string): number {
  const grid = parseGrid(input)
  const accessibleCoords = findAccessibleRollCoords(grid)

  return accessibleCoords.length
}

export function two(input: string): number {
  const grid = parseGrid(input)

  let removed = 0

  while (true) {
    const removableCoords = findAccessibleRollCoords(grid)

    // Break if nothing left to remove.
    if (removableCoords.length === 0) {
      break
    }

    // Otherwise mutate grid and sweep some rolls.
    for (const [r, c] of removableCoords) {
      grid[r][c] = Cell.Dot
    }

    removed += removableCoords.length
  }

  return removed
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/4/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
