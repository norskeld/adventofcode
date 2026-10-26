function parse(input: string): [number[], number[]] {
  const left: number[] = []
  const right: number[] = []

  for (const line of input.trim().split('\n')) {
    const [l, r] = line.trim().split(/\s+/).map(Number)

    left.push(l)
    right.push(r)
  }

  return [left, right]
}

export function one(input: string): number {
  const [left, right] = parse(input)
  const ascending = (a: number, b: number) => a - b

  left.sort(ascending)
  right.sort(ascending)

  let answer = 0

  for (let idx = 0; idx < left.length; idx++) {
    answer += Math.abs(left[idx] - right[idx])
  }

  return answer
}

export function two(input: string): number {
  const [left, right] = parse(input)
  const counts = new Map<number, number>()

  for (const r of right) {
    counts.set(r, (counts.get(r) ?? 0) + 1)
  }

  let answer = 0

  for (const l of left) {
    answer += l * (counts.get(l) ?? 0)
  }

  return answer
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/1/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
