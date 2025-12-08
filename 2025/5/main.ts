class Range {
  constructor(public start: number, public end: number) {}

  includes(value: number): boolean {
    return this.start <= value && value <= this.end
  }
}

export function one(input: string): number {
  const freshIds = new Set<number>()

  const [freshRangesS, availableIdsS] = input.trim().split('\n\n').map(
    (chunk) => chunk.split('\n'),
  )

  for (const range of freshRangesS) {
    const [start, end] = range.split('-').map((value) => parseInt(value))

    for (const availableId of availableIdsS) {
      const id = parseInt(availableId)

      if (id >= start && id <= end) {
        freshIds.add(id)
      }
    }
  }

  return freshIds.size
}

export function two(input: string): number {
  const trimmed = input.trim()
  const divider = trimmed.indexOf('\n\n')

  // We parse the input into ranges, and then sort them by range start to make
  // merging easier.
  const freshRanges = trimmed.substring(0, divider).split('\n')
    .map((range) => range.split('-').map(Number))
    .sort((a, b) => a[0] - b[0])

  // Maintain a separate list of ranges that have been merged and that will be
  // used to merge overlapping ranges.
  const mergedRanges: number[][] = [freshRanges[0]]

  for (let idx = 1; idx < freshRanges.length; idx += 1) {
    const prev = mergedRanges[mergedRanges.length - 1]
    const curr = freshRanges[idx]

    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1])
    } else {
      mergedRanges.push(curr)
    }
  }

  return mergedRanges.reduce((acc, [start, end]) => acc + (end - start + 1), 0)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/5/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
