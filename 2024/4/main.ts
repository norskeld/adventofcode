type Coordinate = [row: number, col: number]

interface LineMatchResult {
  start: Coordinate
  end: Coordinate
  direction: Coordinate
}

interface CrossMatchResult {
  center: Coordinate
  diag1: string
  diag2: string
}

function parseGrid(input: string): string[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => line.split(''))
}

function findLineMatches(grid: string[][], target: string): LineMatchResult[] {
  const rows = grid.length
  const cols = grid[0].length
  const length = target.length
  const matches: LineMatchResult[] = []

  const directions: Coordinate[] = [
    [0, 1], // Right
    [0, -1], // Left
    [1, 0], // Down
    [-1, 0], // Up
    [1, 1], // Down-Right
    [-1, -1], // Up-Left
    [1, -1], // Down-Left
    [-1, 1], // Up-Right
  ]

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] !== target[0]) {
        continue
      }

      for (const [dRow, dCol] of directions) {
        let found = true

        for (let idx = 1; idx < length; idx++) {
          const nRow = row + dRow * idx
          const nCol = col + dCol * idx

          if (
            nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols ||
            grid[nRow][nCol] !== target[idx]
          ) {
            found = false
            break
          }
        }

        if (found) {
          const endRow = row + dRow * (length - 1)
          const endCol = col + dCol * (length - 1)

          matches.push({
            start: [row, col],
            end: [endRow, endCol],
            direction: [dRow, dCol],
          })
        }
      }
    }
  }

  return matches
}

function findCrossMatches(
  grid: string[][],
  target: string,
): CrossMatchResult[] {
  const rows = grid.length
  const cols = grid[0].length
  const k = Math.floor(target.length / 2)
  const revTarget = target.split('').reverse().join('')
  const matches: CrossMatchResult[] = []

  function isValid(chars: string[]): boolean {
    const str = chars.join('')
    return str === target || str === revTarget
  }

  for (let row = k; row < rows - k; row++) {
    for (let col = k; col < cols - k; col++) {
      if (grid[row][col] !== target[k]) {
        continue
      }

      const diag1: string[] = []
      const diag2: string[] = []

      for (let idx = -k; idx <= k; idx++) {
        diag1.push(grid[row + idx][col + idx])
        diag2.push(grid[row + idx][col - idx])
      }

      if (isValid(diag1) && isValid(diag2)) {
        matches.push({
          center: [row, col],
          diag1: diag1.join(''),
          diag2: diag2.join(''),
        })
      }
    }
  }

  return matches
}

export function one(input: string): number {
  const grid = parseGrid(input)
  const matches = findLineMatches(grid, 'XMAS')

  return matches.length
}

export function two(input: string): number {
  const grid = parseGrid(input)
  const matches = findCrossMatches(grid, 'MAS')

  return matches.length
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/4/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
