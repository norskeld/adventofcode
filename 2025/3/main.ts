function findMaxJoltageN(batteries: number[], n: number = 2): number {
  const joltages: number[] = []
  const length = batteries.length

  let remaining = n
  let pos = -1

  while (remaining > 0) {
    // Find the max digit in the remaining available slice.
    const slice = batteries.slice(
      // The slice starts after the last selected index.
      pos + 1,
      // The slice ends early enough to have for the remaining required batteries.
      length - remaining + 1,
    )

    const joltage = Math.max(...slice)

    // Find the position of this max digit in the bank (after the last selected index).
    pos = batteries.indexOf(joltage, pos + 1)

    joltages.push(joltage)
    remaining -= 1
  }

  const concatenated = joltages.reduce((acc, n) => acc + n, String())
  const maxJoltage = parseInt(concatenated)

  return maxJoltage
}

export function one(input: string): number {
  let total = 0

  for (const bank of input.trim().split('\n')) {
    const batteries = bank.split('').map((it) => parseInt(it))
    const maxJoltage = findMaxJoltageN(batteries, 2)

    total += maxJoltage
  }

  return total
}

export function two(input: string): number {
  let total = 0

  for (const bank of input.trim().split('\n')) {
    const batteries = bank.split('').map((it) => parseInt(it))
    const maxJoltage = findMaxJoltageN(batteries, 12)

    total += maxJoltage
  }

  return total
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/3/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
