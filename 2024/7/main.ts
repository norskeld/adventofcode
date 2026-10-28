interface Equation {
  total: number
  operands: number[]
}

function parse(input: string): Equation[] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [totalRaw, operandsRaw] = line.split(':')
      const total = Number(totalRaw)
      const operands = operandsRaw.trim().split(' ').map(Number)

      return {
        total,
        operands,
      }
    })
}

function canSolve(
  eq: Equation,
  index: number,
  current: number,
): boolean {
  if (index === eq.operands.length) return current === eq.total
  if (current > eq.total) return false

  const next = eq.operands[index]

  return (
    canSolve(eq, index + 1, current + next) ||
    canSolve(eq, index + 1, current * next)
  )
}

function canSolveWithConcatenation(
  eq: Equation,
  index: number,
  current: number,
): boolean {
  if (index === eq.operands.length) return current === eq.total
  if (current > eq.total) return false

  const next = eq.operands[index]
  const concatenated = Number(`${current}${next}`)

  return (
    canSolveWithConcatenation(eq, index + 1, current + next) ||
    canSolveWithConcatenation(eq, index + 1, current * next) ||
    canSolveWithConcatenation(eq, index + 1, concatenated)
  )
}

export function one(input: string): number {
  return parse(input).reduce(
    (acc, eq) => canSolve(eq, 1, eq.operands[0]) ? acc + eq.total : acc,
    0,
  )
}

export function two(input: string): number {
  return parse(input).reduce(
    (acc, eq) =>
      canSolveWithConcatenation(eq, 1, eq.operands[0]) ? acc + eq.total : acc,
    0,
  )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/7/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
