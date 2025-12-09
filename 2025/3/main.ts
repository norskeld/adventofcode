function parseBatteries(input: string): number[][] {
  return input.trim().split('\n').map((bank) =>
    bank.split('').map((it) => parseInt(it))
  )
}

function findMaxJoltageN(batteries: number[], n: number = 2): number {
  const joltages: number[] = []
  const length = batteries.length

  let remaining = n
  let pos = -1

  while (remaining > 0) {
    // Find the max digit in the remaining available slice.
    const slice = batteries.slice(
      // It starts after the last selected index.
      pos + 1,
      // It ends early enough to have for the remaining required batteries.
      length - remaining + 1,
    )

    const joltage = Math.max(...slice)

    // Find the position of this max digit in the bank (after the last selected
    // index).
    pos = batteries.indexOf(joltage, pos + 1)

    joltages.push(joltage)
    remaining -= 1
  }

  const concatenated = joltages.reduce((acc, n) => acc + n, String())
  const maxJoltage = parseInt(concatenated)

  return maxJoltage
}

export function one(input: string): number {
  return parseBatteries(input)
    .reduce(
      (acc, batteries) => acc + findMaxJoltageN(batteries, 2),
      0,
    )
}

export function two(input: string): number {
  return parseBatteries(input)
    .reduce(
      (acc, batteries) => acc + findMaxJoltageN(batteries, 12),
      0,
    )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/3/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
