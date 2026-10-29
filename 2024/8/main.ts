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

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const freq = grid[row][col]

      if (freq === '.') {
        continue
      }

      const coords = antennas.get(freq) ?? []

      coords.push([row, col])
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
        const [aRow, aCol] = coords[i]
        const [bRow, bCol] = coords[j]
        const dRow = bRow - aRow
        const dCol = bCol - aCol

        // antinode <- A ←—— d ——→ B -> antinode
        // (a - d)    (a)         (b)    (b + d)
        const nodes: Coord[] = [
          [aRow - dRow, aCol - dCol],
          [bRow + dRow, bCol + dCol],
        ]

        for (const [nRow, nCol] of nodes) {
          if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols) {
            continue
          }

          antinodes.add(`${nRow}:${nCol}`)
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
        const [aRow, aCol] = coords[i]
        const [bRow, bCol] = coords[j]
        const dRow = bRow - aRow
        const dCol = bCol - aCol

        // Every position along the line through the pair is an antinode,
        // including the antennas themselves.
        for (const sign of [-1, 1]) {
          let nRow = aRow
          let nCol = aCol

          while (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
            antinodes.add(`${nRow}:${nCol}`)

            nRow += sign * dRow
            nCol += sign * dCol
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
