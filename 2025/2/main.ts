/** Returns the number of digits in a number. */
function digitsN(n: number): number {
  return Math.floor(Math.log10(n) + 1)
}

/**
 * Splits a number with even number of digits in half, e.g. 2321 -> [23, 21],
 * 123123 -> [123, 123], and returns true if both parts are equal.
 */
function binaryEqual(n: number, digits: number): boolean {
  const half = digits / 2
  const divisor = 10 ** half
  const quotient = Math.trunc(n / divisor)
  const remainder = n % divisor

  return quotient === remainder
}

/**
 * Splits a number into sequences and tries to reconstruct it by diving it
 * into lesser and lesser chunks to compare them and return true if all equal.
 */
function naryEqual(n: number, digits: number): boolean {
  // 2121212121 10 -> 5
  // 824824824   9 -> 3
  // 565656      6 -> 3
  // 38593859    8 -> 2
  for (let rep = Math.trunc(digits / 2); rep >= 1; rep -= 1) {
    if (digits % rep !== 0) {
      continue
    }

    const cycles = digits / rep
    const divisor = 10 ** rep

    // Get the first sequence to test.
    const seq = Math.floor(n / (divisor ** (cycles - 1)))

    // Reconstruct expected number if seq repeats cycles times.
    let expected = 0
    let counter = 0

    while (counter < cycles) {
      expected = expected * divisor + seq
      counter += 1
    }

    if (expected === n) {
      return true
    }
  }

  return false
}

/**
 * Returns true if number has even number of digits, e.g. 22, 3554, 432256,
 * and so on.
 */
function evenDigitsN(n: number): boolean {
  return n !== 0 && digitsN(n) % 2 === 0
}

export function one(input: string): number {
  let sum = 0

  for (const range of input.split(',')) {
    const [start, end] = range.split('-').map((it) => parseInt(it))

    // Skip whole range if its start and end have odd number of digits.
    if (!evenDigitsN(start) && !evenDigitsN(end)) {
      continue
    }

    for (let it = start; it <= end; it += 1) {
      const digits = digitsN(it)

      // Only consider numbers with even number of digits.
      if (digits % 2 === 0 && binaryEqual(it, digits)) {
        sum += it
      }
    }
  }

  return sum
}

export function two(input: string): number {
  let sum = 0

  for (const range of input.split(',')) {
    const [start, end] = range.split('-').map((it) => parseInt(it))

    for (let it = start; it <= end; it += 1) {
      const digits = digitsN(it)

      if (digits >= 2 && naryEqual(it, digits)) {
        sum += it
      }
    }
  }

  return sum
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/2/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
