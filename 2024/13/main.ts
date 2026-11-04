type Equation = [
  a: number,
  b: number,
  c: number,
]

interface Machine {
  x: Equation
  y: Equation
}

interface Solution {
  a: number
  b: number
}

const BUTTON_RE = /X\+(\d+), Y\+(\d+)/
const PRIZE_RE = /X=(\d+), Y=(\d+)/

const BUTTON_A_COST = 3
const BUTTON_B_COST = 1

function parseMachines(input: string): Machine[] {
  const machines: Machine[] = []

  for (const block of input.trim().split('\n\n')) {
    const [buttonA, buttonB, prize] = block.trim().split('\n')

    const [, aX, aY] = buttonA.match(BUTTON_RE)!
    const [, bX, bY] = buttonB.match(BUTTON_RE)!
    const [, cX, cY] = prize.match(PRIZE_RE)!

    machines.push({
      x: [Number(aX), Number(bX), Number(cX)],
      y: [Number(aY), Number(bY), Number(cY)],
    })
  }

  return machines
}

/**
 * Button A: X+94, Y+34
 * Button B: X+22, Y+67
 * Prize: X=8400, Y=5400
 *
 * Translates to the following system of linear equations:
 *
 * 94a + 22b = 8400
 * 34a + 67b = 5400
 *
 * ---
 *
 * A system of linear equations like this (2x2 or 3x3):
 *
 * a1·a + b1·b = c1
 * a2·a + b2·b = c2
 *
 * Can be solved using Cramer's rule:
 *
 * [ a1 b1 ]
 * [ a2 b2 ]
 *
 * D  = (a1·b2) - (a2·b1) — Main determinant
 * Da = (c1·b2) - (c2·b1) — Determinant a
 * Db = (a1·c2) - (a2·c1) — Determinant b
 *
 * a = Da / D
 * b = Db / D
 */
function solveSystem(eq1: Equation, eq2: Equation): Solution | null {
  const [a1, b1, c1] = eq1
  const [a2, b2, c2] = eq2

  const D = (a1 * b2) - (a2 * b1)
  const Da = (c1 * b2) - (c2 * b1)
  const Db = (a1 * c2) - (a2 * c1)

  if (D === 0) {
    return null
  }

  const a = Da / D
  const b = Db / D

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    return null
  }

  return { a, b }
}

function calculateCost({ a, b }: Solution): number {
  return a * BUTTON_A_COST + b * BUTTON_B_COST
}

export function one(input: string): number {
  return parseMachines(input).reduce((acc, { x, y }) => {
    const solution = solveSystem(x, y)
    return solution ? acc + calculateCost(solution) : acc
  }, 0)
}

export function two(input: string): number {
  return parseMachines(input).reduce(
    (acc, { x: [xa, xb, xc], y: [ya, yb, yc] }) => {
      const solution = solveSystem(
        [xa, xb, xc + 10000000000000],
        [ya, yb, yc + 10000000000000],
      )

      return solution ? acc + calculateCost(solution) : acc
    },
    0,
  )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/13/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
