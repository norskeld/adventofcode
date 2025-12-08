type Grid = boolean[][]
type Direction = [x: number, y: number]

const directions: Direction[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
]

function parseGrid(input: string): [grid: Grid, width: number, height: number] {
  const grid: Grid = []

  for (const [y, row] of input.trim().split('\n').entries()) {
    for (const [x, char] of row.split('').entries()) {
      if (!grid[y]) {
        grid[y] = []
      }

      grid[y][x] = char === '@'
    }
  }

  const width = grid[0].length
  const height = grid.length

  return [grid, width, height]
}

export function one(input: string): number {
  const [grid, width, height] = parseGrid(input)

  let accessible = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const roll = grid[y][x]

      if (roll) {
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

          if (grid[neighborY][neighborX]) {
            neighbors += 1
          }
        }

        if (neighbors < 4) {
          accessible += 1
        }
      }
    }
  }

  return accessible
}

export function two(input: string): number {
  return 0
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/4/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
