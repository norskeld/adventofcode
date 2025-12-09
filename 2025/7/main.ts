const START = 'S'
const SPACE = '.'
const SPLITTER = '^'

function prepare(input: string): string[] {
  // Prepare lines by only leaving lines with splitters and the start point,
  // empty lines don't actually matter.
  const lines = input.trim()
    .split('\n')
    .filter((line) => line.includes(SPLITTER) || line.includes(START))

  return lines
}

function findAllBeams(lines: string[]): [number, Map<number, number>] {
  const startPos = lines[0].indexOf(START)

  let total = 0

  // The map tracks column positions to beam counts. Multiple beams can converge
  // at the same position, but a splitter only counts as one split regardless of
  // how many beams hit it. However, we track beam counts (not just positions)
  // because part 2 needs the total number of beam paths exiting the manifold.
  //
  // Tracks column index -> number of beams at that position. Starts with a
  // single beam at the S position.
  //
  // Reallocating a new map per line is inefficient but simple and clean.
  let allBeams = new Map<number, number>([
    [startPos, 1],
  ])

  // Process each row, propagating beams downward.
  for (let idx = 1; idx < lines.length; idx++) {
    const line = lines[idx]
    const localBeams = new Map<number, number>()

    for (const [k, v] of allBeams) {
      // On empty space beam continues straight down, preserving its count.
      if (line[k] === SPACE) {
        const currentValue = localBeams.get(k) ?? 0
        localBeams.set(k, currentValue + v)
      }

      // On splitter count one split event, then spawn beams left and right.
      // The beam count v is propagated to both new positions.
      if (line[k] === SPLITTER) {
        total += 1

        const left = localBeams.get(k - 1) ?? 0
        localBeams.set(k - 1, left + v)

        const right = localBeams.get(k + 1) ?? 0
        localBeams.set(k + 1, right + v)
      }
    }

    allBeams = localBeams
  }

  return [total, allBeams]
}

export function one(input: string): number {
  const lines = prepare(input)
  const [total] = findAllBeams(lines)

  return total
}

export function two(input: string): number {
  const lines = prepare(input)
  const [, allBeams] = findAllBeams(lines)

  return Array.from(allBeams.values()).reduce(
    (sum, current) => sum + current,
    0,
  )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/7/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
