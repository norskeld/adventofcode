const enum Cell {
  Roll,
  Dot,
}

type Point = [x: number, y: number]

interface Grid {
  cells: Cell[][]
  width: number
  height: number
}

const directions: Point[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
]

function parseGrid(input: string): Grid {
  const cells: Cell[][] = []

  for (const [y, row] of input.trim().split('\n').entries()) {
    for (const [x, char] of row.split('').entries()) {
      if (!cells[y]) {
        cells[y] = []
      }

      cells[y][x] = char === '@' ? Cell.Roll : Cell.Dot
    }
  }

  const width = cells[0].length
  const height = cells.length

  return {
    cells,
    width,
    height,
  }
}

function findAccessibleRollPoints({ cells, width, height }: Grid): Point[] {
  const accessibleRollPoints: Point[] = []

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = cells[y][x]

      if (cell === Cell.Roll) {
        let neighbors = 0

        for (const [directionX, directionY] of directions) {
          const neighborY = y + directionY
          const neighborX = x + directionX

          if (
            neighborY < 0 || neighborY >= height || neighborX < 0 ||
            neighborX >= width
          ) {
            continue
          }

          if (cells[neighborY][neighborX] === Cell.Roll) {
            neighbors += 1
          }
        }

        if (neighbors < 4) {
          accessibleRollPoints.push([x, y])
        }
      }
    }
  }

  return accessibleRollPoints
}

export function one(input: string): number {
  const grid = parseGrid(input)
  const accessiblePoints = findAccessibleRollPoints(grid)

  return accessiblePoints.length
}

export function two(input: string): number {
  const grid = parseGrid(input)

  let removed = 0

  while (true) {
    const removablePoints = findAccessibleRollPoints(grid)

    // Break if nothing left to remove.
    if (removablePoints.length === 0) {
      break
    }

    // Otherwise mutate grid and sweep some rolls.
    for (const [x, y] of removablePoints) {
      grid.cells[y][x] = Cell.Dot
    }

    removed += removablePoints.length
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
