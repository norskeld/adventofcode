const operators = ['+', '*']

function sum(numbers: number[]): number {
  return numbers.reduce((acc, it) => acc + it, 0)
}

function product(numbers: number[]): number {
  return numbers.reduce((acc, it) => acc * it, 1)
}

function rotateRight<T>(matrix: T[][]): T[][] {
  const result: T[][] = []

  const rows = matrix.length
  const cols = matrix[0].length

  for (let col = 0; col < cols; col++) {
    const reversed: T[] = []

    for (let row = rows - 1; row >= 0; row--) {
      reversed.push(matrix[row][col])
    }

    result.push(reversed)
  }

  return result
}

function findOperatorDistances(line: string): number[] {
  const chars = line.split('')
  const distances: number[] = []

  // Operator line below has distance of 3:
  //
  // |*   +    *  +   |
  // | ^^^            |
  // |0123456789......|
  //
  // Distance between operators can be different, so we need all distances
  // between operators.
  for (let idx = 0; idx < chars.length; idx++) {
    const char = chars[idx]

    if (operators.includes(char)) {
      distances.push(idx)
    }
  }

  return distances
}

function parseWorksheet(input: string) {
  const [operatorsRaw, ...numbersRaw] = input.trim().split('\n').reverse()

  // Numbers are positioned in a very specific way above the operators, we need
  // to preserve it somehow.
  //
  // To do that, we need to get the distances between the operators.
  const distances = findOperatorDistances(operatorsRaw)

  // Also get all operators.
  const operators = operatorsRaw
    .split('')
    .filter((char) => char !== ' ')

  // Also get the max distance (line length).
  const maxDistance = Math.max(...numbersRaw.map((line) => line.length))

  // After that we can proceed and parse number lines chunking them into D + 1
  // chunks (considering space between numbers).
  const chunks = numbersRaw.map((line) => {
    const chunk: string[] = []

    for (let idx = 0; idx < distances.length; idx++) {
      const curr = distances[idx]
      const next = distances[idx + 1] ?? maxDistance + 1

      if (next) {
        chunk.push(
          line.substring(curr, next - 1),
        )
      }
    }

    return chunk
  })

  // Finally, we join operators with the numbers and rotate the matrix clockwise
  // to ease further calculations.
  return rotateRight([...chunks, operators])
}

export function one(input: string): number {
  return parseWorksheet(input).reduce((acc, [op, ...strings]) => {
    const numbers = strings.map((it) => parseInt(it))

    if (op === '+') return acc + sum(numbers)
    if (op === '*') return acc + product(numbers)

    return acc
  }, 0)
}

export function two(input: string): number {
  return parseWorksheet(input).reduce((acc, [op, ...strings]) => {
    const maxDistance = Math.max(...strings.map((s) => s.length))
    const numbers: number[] = []

    for (let step = 0; step < maxDistance; step++) {
      let num = 0
      let multiplier = 1

      // Build number from last string to first.
      for (let idx = strings.length - 1; idx >= 0; idx--) {
        const char = strings[idx].charAt(maxDistance - 1 - step)

        if (char && char !== ' ') {
          num += parseInt(char) * multiplier
          multiplier *= 10
        }
      }

      if (multiplier > 1) {
        numbers.push(num)
      }
    }

    if (op === '+') return acc + sum(numbers)
    if (op === '*') return acc + product(numbers)

    return acc
  }, 0)
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/6/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
