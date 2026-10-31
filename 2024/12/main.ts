type Coord = [
  row: number,
  col: number,
]

interface Region {
  label: string
  area: number
  perimeter: number
  sides: number
}

const DIRECTIONS: Coord[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

const CORNERS: [Coord, Coord][] = [
  [[-1, 0], [0, 1]],
  [[0, 1], [1, 0]],
  [[1, 0], [0, -1]],
  [[0, -1], [-1, 0]],
]

function parseGrid(input: string): string[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => line.split(''))
}

function findRegions(grid: string[][]): Region[] {
  const rows = grid.length
  const cols = grid[0].length
  const regions: Region[] = []

  const seen = Array.from(
    { length: rows },
    () => new Array<boolean>(cols).fill(false),
  )

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (seen[r][c]) {
        continue
      }

      const label = grid[r][c]
      const region: Region = { label, area: 0, perimeter: 0, sides: 0 }
      const stack: Coord[] = [[r, c]]
      seen[r][c] = true

      const same = (row: number, col: number): boolean =>
        grid[row]?.[col] === label

      while (stack.length > 0) {
        const [cr, cc] = stack.pop()!
        region.area++

        for (const [dr, dc] of DIRECTIONS) {
          const nr = cr + dr
          const nc = cc + dc

          if (!same(nr, nc)) {
            region.perimeter++
          } else if (!seen[nr][nc]) {
            seen[nr][nc] = true
            stack.push([nr, nc])
          }
        }

        for (const [[ar, ac], [br, bc]] of CORNERS) {
          const a = same(cr + ar, cc + ac)
          const b = same(cr + br, cc + bc)
          const diagonal = same(cr + ar + br, cc + ac + bc)

          if (!a && !b) {
            region.sides++
          } else if (a && b && !diagonal) {
            region.sides++
          }
        }
      }

      regions.push(region)
    }
  }

  return regions
}

export function one(input: string): number {
  const grid = parseGrid(input)
  const regions = findRegions(grid)

  return regions.reduce((acc, r) => acc + (r.area * r.perimeter), 0)
}

export function two(input: string): number {
  const grid = parseGrid(input)
  const regions = findRegions(grid)

  return regions.reduce((acc, r) => acc + (r.area * r.sides), 0)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/12/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
