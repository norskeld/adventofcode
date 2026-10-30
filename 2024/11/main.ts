function digitCount(n: number): number {
  return n < 10 ? 1 : Math.floor(Math.log10(n)) + 1
}

function split(n: number): [number, number] {
  const divisor = 10 ** (digitCount(n) / 2)
  return [Math.floor(n / divisor), n % divisor]
}

/**
 * This one was tricky to figure out, because I tunnel-visioned too hard on
 * naive attempts to modify the actual list of stones.
 *
 * The problem doesn't need it at all. We only need to know how many stones does
 * stone X become after Y blinks.
 *
 * So, at every blink, each stone transforms independently. The whole collection
 * after n blinks is just the union of each starting stone's descendants:
 *
 * total(stones, n) = Σ count(stone, n)
 *
 * count(0, n)             = count(1, n - 1)
 * count(x, n) with x = 2k = count(left(x), n - 1) + count(right(x), n - 1)
 * count(x, n) otherwise   = count(x * 2024, n - 1)
 * count(x, 0) base case   = 1
 *
 * This needs memoization to collapse performed work though, otherwise it leads
 * to the exponential blowup.
 */
function expand(input: string, blinks: number): number {
  const stones = input.trim().split(' ').map(Number)
  const memo = new Map<string, number>()

  function count(stone: number, remaining: number): number {
    if (remaining === 0) {
      return 1
    }

    const key = `${stone}:${remaining}`
    const cached = memo.get(key)

    if (cached !== undefined) {
      return cached
    }

    let result: number

    if (stone === 0) {
      result = count(1, remaining - 1)
    } else if (digitCount(stone) % 2 === 0) {
      const [left, right] = split(stone)
      result = count(left, remaining - 1) + count(right, remaining - 1)
    } else {
      result = count(stone * 2024, remaining - 1)
    }

    memo.set(key, result)

    return result
  }

  return stones.reduce((acc, stone) => acc + count(stone, blinks), 0)
}

export function one(input: string): number {
  return expand(input, 25)
}

export function two(input: string): number {
  return expand(input, 75)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/11/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
