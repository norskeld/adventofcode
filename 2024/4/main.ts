type Coord = [
  row: number,
  col: number,
]

interface LineMatchResult {
  start: Coord
  end: Coord
  direction: Coord
}

interface CrossMatchResult {
  center: Coord
  diag1: string
  diag2: string
}

const DIRECTIONS: Coord[] = [
  [0, 1], // Right
  [0, -1], // Left
  [1, 0], // Down
  [-1, 0], // Up
  [1, 1], // Down-Right
  [-1, -1], // Up-Left
  [1, -1], // Down-Left
  [-1, 1], // Up-Right
]

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

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== target[0]) {
        continue
      }

      for (const [dr, dc] of DIRECTIONS) {
        let found = true

        for (let idx = 1; idx < length; idx++) {
          const nr = r + dr * idx
          const nc = c + dc * idx

          if (
            nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
            grid[nr][nc] !== target[idx]
          ) {
            found = false
            break
          }
        }

        if (found) {
          const er = r + dr * (length - 1)
          const ec = c + dc * (length - 1)

          matches.push({
            start: [r, c],
            end: [er, ec],
            direction: [dr, dc],
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

  for (let r = k; r < rows - k; r++) {
    for (let c = k; c < cols - k; c++) {
      if (grid[r][c] !== target[k]) {
        continue
      }

      const diag1: string[] = []
      const diag2: string[] = []

      for (let idx = -k; idx <= k; idx++) {
        diag1.push(grid[r + idx][c + idx])
        diag2.push(grid[r + idx][c - idx])
      }

      if (isValid(diag1) && isValid(diag2)) {
        matches.push({
          center: [r, c],
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
