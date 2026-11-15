interface State {
  patterns: string[]
  designs: string[]
}

function parse(input: string): State {
  const [patternsRaw, designsRaw] = input
    .trim()
    .split('\n\n')

  const patterns = patternsRaw
    .trim()
    .split(',')
    .map((p) => p.trim())

  const designs = designsRaw
    .trim()
    .split('\n')

  return { patterns, designs }
}

function canConstruct(design: string, patterns: string[]): boolean {
  const dp = Array(design.length + 1).fill(false)
  dp[0] = true

  for (let idx = 1; idx <= design.length; idx++) {
    for (const pattern of patterns) {
      const len = pattern.length

      if (
        idx >= len &&
        dp[idx - len] &&
        design.slice(idx - len, idx) === pattern
      ) {
        dp[idx] = true
        break
      }
    }
  }

  return dp[design.length]
}

function possibleCount(design: string, patterns: string[]): number {
  const dp = Array(design.length + 1).fill(0)
  dp[0] = 1

  for (let idx = 1; idx <= design.length; idx++) {
    for (const pattern of patterns) {
      const len = pattern.length

      if (
        idx >= len &&
        dp[idx - len] > 0 &&
        design.slice(idx - len, idx) === pattern
      ) {
        dp[idx] += dp[idx - len]
      }
    }
  }

  return dp[design.length]
}

export function one(input: string): number {
  const { patterns, designs } = parse(input)

  return designs.reduce(
    (acc, design) => acc + Number(canConstruct(design, patterns)),
    0,
  )
}

export function two(input: string): number {
  const { patterns, designs } = parse(input)

  return designs.reduce(
    (acc, design) => acc + Number(possibleCount(design, patterns)),
    0,
  )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/19/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
