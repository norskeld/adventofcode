type Coord = [
  row: number,
  col: number,
]

interface ParseResult {
  rows: number
  cols: number
  antennas: Map<string, Coord[]>
}

function parseGrid(input: string): ParseResult {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''))

  const rows = grid.length
  const cols = grid[0].length
  const antennas: Map<string, Coord[]> = new Map()

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const freq = grid[r][c]

      if (freq === '.') {
        continue
      }

      const coords = antennas.get(freq) ?? []

      coords.push([r, c])
      antennas.set(freq, coords)
    }
  }

  return {
    rows,
    cols,
    antennas,
  }
}

export function one(input: string): number {
  const { rows, cols, antennas } = parseGrid(input)
  const antinodes: Set<string> = new Set()

  for (const coords of antennas.values()) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [ar, ac] = coords[i]
        const [br, bc] = coords[j]
        const dr = br - ar
        const dc = bc - ac

        // antinode <- A ←—— d ——→ B -> antinode
        // (a - d)    (a)         (b)    (b + d)
        const nodes: Coord[] = [
          [ar - dr, ac - dc],
          [br + dr, bc + dc],
        ]

        for (const [nr, nc] of nodes) {
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue
          }

          antinodes.add(`${nr}:${nc}`)
        }
      }
    }
  }

  return antinodes.size
}

export function two(input: string): number {
  const { rows, cols, antennas } = parseGrid(input)
  const antinodes: Set<string> = new Set()

  for (const coords of antennas.values()) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [ar, ac] = coords[i]
        const [br, bc] = coords[j]
        const dr = br - ar
        const dc = bc - ac

        // Every position along the line through the pair is an antinode,
        // including the antennas themselves.
        for (const sign of [-1, 1]) {
          let nr = ar
          let nc = ac

          while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            antinodes.add(`${nr}:${nc}`)

            nr += sign * dr
            nc += sign * dc
          }
        }
      }
    }
  }

  return antinodes.size
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/8/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
