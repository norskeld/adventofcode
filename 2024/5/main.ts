interface State {
  rules: number[][]
  updates: number[][]
}

function parse(input: string): State {
  const [rulesRaw, updatesRaw] = input.trim().split('\n\n')

  const rules = rulesRaw
    .trim()
    .split('\n')
    .map((line) => line.split('|').map(Number))

  const updates = updatesRaw
    .trim()
    .split('\n')
    .map((line) => line.split(',').map(Number))

  return {
    rules,
    updates,
  }
}

export function one(input: string): number {
  const state = parse(input)

  let midSum = 0

  for (const update of state.updates) {
    const indices = new Map()

    for (const [index, page] of update.entries()) {
      indices.set(page, index)
    }

    let isValid = true

    for (const [x, y] of state.rules) {
      if (indices.has(x) && indices.has(y)) {
        if (indices.get(x)! > indices.get(y)!) {
          isValid = false
          break
        }
      }
    }

    if (isValid) {
      const midIndex = Math.floor(update.length / 2)
      midSum += update[midIndex]
    }
  }

  return midSum
}

export function two(input: string): number {
  const state = parse(input)
  const ruleSet = new Set(state.rules.map(([x, y]) => `${x}|${y}`))

  let incorrectMidSum = 0

  for (const update of state.updates) {
    const indices = new Map()

    for (const [index, page] of update.entries()) {
      indices.set(page, index)
    }

    let isValid = true

    for (const [x, y] of state.rules) {
      if (indices.has(x) && indices.has(y)) {
        if (indices.get(x)! > indices.get(y)!) {
          isValid = false
          break
        }
      }
    }

    if (!isValid) {
      update.sort((a, b) => {
        if (ruleSet.has(`${a}|${b}`)) return -1
        if (ruleSet.has(`${b}|${a}`)) return 1
        return 0
      })

      const midIndex = Math.floor(update.length / 2)
      incorrectMidSum += update[midIndex]
    }
  }

  return incorrectMidSum
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/5/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
