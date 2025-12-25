interface Machine {
  lights: number[]
  buttons: number[][]
  joltages: number[]
}

// Turns a list of 1s and 0s into a binary number.
function intoBinary(numbers: number[]): number {
  return numbers.reduce((acc, bit) => (acc << 1) | bit, 0)
}

// Generates all r-length combinations from 0..n-1.
function* combinations(n: number, r: number): Generator<number[]> {
  if (r === 0) {
    yield []
    return
  }

  if (r > n) {
    return
  }

  for (let i = 0; i <= n - r; i++) {
    for (const rest of combinations(n - i - 1, r - 1)) {
      yield [i, ...rest.map((x) => x + i + 1)]
    }
  }
}

// Generates all n-bit binary patterns as arrays.
function product(n: number): number[][] {
  const result: number[][] = []
  const total = 2 ** n

  for (let i = 0; i < total; i++) {
    const pattern: number[] = []

    for (let j = 0; j < n; j++) {
      pattern.push((i >> j) & 1)
    }

    result.push(pattern)
  }

  return result
}

// Turns a list of button presses into a list of binary numbers which represent
// the button presses that later are used to XOR with the light configuration.
function intoBinaryButtons(lights: number, buttons: number[][]): number[] {
  return buttons.map((button) => {
    // (0, _, 2, 3, 4) -> 10111
    const numbers: number[] = Array(lights).fill(0)

    for (const index of button) {
      numbers[index] = 1
    }

    return intoBinary(numbers)
  })
}

function parseLights(input: string): number[] {
  return [...input.substring(1, input.length - 1)].map((char) =>
    char === '#' ? 1 : 0
  )
}

function parseButtons(chunks: string[]): number[][] {
  return chunks
    .map((chunk) =>
      chunk
        .substring(1, chunk.length - 1)
        .split(',')
        .map(Number)
    )
}

function parseJoltages(input: string): number[] {
  return input
    .substring(1, input.length - 1)
    .split(',')
    .map(Number)
}

function parseMachines(input: string): Machine[] {
  return input
    .trim()
    .split('\n')
    .map((line) => line.split(' '))
    .map((components) => {
      const lights = parseLights(components.shift()!)
      const joltages = parseJoltages(components.pop()!)
      const buttons = parseButtons(components)

      return { lights, buttons, joltages }
    })
}

function findMinButtonPresses(machine: Machine): number {
  const target = intoBinary(machine.lights)
  const buttons = intoBinaryButtons(machine.lights.length, machine.buttons)
  const queue: [state: number, button: number][] = [[0, 0]]

  // Track visited states to avoid cycles.
  const visited = new Set([0])

  // We use BFS to find the shortest path to the target state.
  while (queue.length) {
    const [state, presses] = queue.shift()!

    // Check if we've reached the target light configuration.
    if (state === target) {
      return presses
    }

    // Try pressing each button to generate new states.
    for (const button of buttons) {
      // Each button XORs a bit pattern with the current state.
      const newState = state ^ button

      // Only explore states we haven't seen before.
      if (!visited.has(newState)) {
        visited.add(newState)
        queue.push([newState, presses + 1])
      }
    }
  }

  return 0
}

// Generates all button press patterns grouped by parity.
function generatePatterns(
  coeffs: number[][],
): Map<string, Map<string, number>> {
  const numButtons = coeffs.length
  const numVariables = coeffs[0].length

  // Initialize with all parity patterns.
  const out = new Map<string, Map<string, number>>()

  for (const parityPattern of product(numVariables)) {
    out.set(parityPattern.join(','), new Map())
  }

  // Generate all button combinations.
  for (let numPressed = 0; numPressed <= numButtons; numPressed++) {
    for (const buttons of combinations(numButtons, numPressed)) {
      // Sum coefficients for pressed buttons.
      const pattern = Array(numVariables).fill(0)

      for (const btnIdx of buttons) {
        for (let i = 0; i < numVariables; i++) {
          pattern[i] += coeffs[btnIdx][i]
        }
      }

      // Calculate parity pattern.
      const parityPattern = pattern.map((p) => p % 2).join(',')
      const patternStr = pattern.join(',')

      // Store if not already present.
      const parityMap = out.get(parityPattern)!

      if (!parityMap.has(patternStr)) {
        parityMap.set(patternStr, numPressed)
      }
    }
  }

  return out
}

// The algorithm [^1] operates in three phases.
//
// First, it transforms each button into a coefficient vector where each
// position indicates whether pressing that button affects the corresponding
// joltage (1 if yes, 0 if no). These coefficient vectors are then passed to
// `generatePatterns` which precomputes all possible combinations of button
// presses along with their total costs, grouped by parity signature.
//
// Then, the solving phase uses memoized recursion with a key insight: when you
// press a combination of buttons that produces a pattern, the effect on
// joltages follows a doubling principle. The recursive function `solve` works
// backwards from the target joltage configuration. For any given goal state, it
// considers all precomputed patterns that share the same parity signature (the
// mod-2 value of each joltage position). This parity matching is crucial
// because it ensures mathematical feasibility.
//
// Finally, we do pattern application. When a pattern is applied, the algorithm
// checks that each coefficient in the pattern doesn't exceed the corresponding
// goal value. If valid, it computes a new subgoal by subtracting the pattern
// from the goal and dividing each component by 2. The total cost for this path
// is the pattern's press cost plus twice the cost of solving the halved
// subgoal. The factor of 2 reflects the doubling relationship inherent in the
// problem mechanics.
//
// [^1]: https://reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
function findMinJoltagePresses(machine: Machine): number {
  // Convert buttons to coefficient format.
  const coeffs = machine.buttons.map((button) =>
    Array.from(
      { length: machine.joltages.length },
      (_, idx) => button.includes(idx) ? 1 : 0,
    )
  )

  // Generate patterns.
  const patternCosts = generatePatterns(coeffs)
  const memo = new Map<string, number>()

  // Memoized recursive solver.
  function solve(goal: number[]): number {
    // Base case: all zeros.
    if (goal.every((g) => g === 0)) {
      return 0
    }

    // Check memo.
    const key = goal.join(',')

    if (memo.has(key)) {
      return memo.get(key)!
    }

    // Try patterns with matching parity.
    const parityKey = goal.map((g) => g % 2).join(',')
    let answer = 1_000_000

    for (const [patternStr, pressCost] of patternCosts.get(parityKey) ?? []) {
      const pattern = patternStr.split(',').map(Number)

      // Check if pattern fits within goal.
      if (pattern.every((p, idx) => p <= goal[idx])) {
        const newGoal = goal.map((g, idx) => (g - pattern[idx]) / 2)
        const totalCost = pressCost + 2 * solve(newGoal)

        answer = Math.min(answer, totalCost)
      }
    }

    memo.set(key, answer)

    return answer
  }

  return solve(machine.joltages)
}

export function one(input: string): number {
  return parseMachines(input)
    .map((machine) => findMinButtonPresses(machine))
    .reduce((acc, value) => acc + value, 0)
}

export function two(input: string): number {
  return parseMachines(input)
    .map((machine) => findMinJoltagePresses(machine))
    .reduce((acc, value) => acc + value, 0)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/10/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
