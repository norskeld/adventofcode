type Operation =
  | { type: 'mul'; lhs: number; rhs: number }
  | { type: 'do' }
  | { type: 'dont' }

interface Parsed {
  operation: Operation
  end: number
}

interface ParsedNumber {
  value: number
  end: number
}

function readNumber(input: string, start: number): ParsedNumber | null {
  let end = start

  while (end < input.length) {
    const code = input.charCodeAt(end)

    if (code < 48 || code > 57) {
      break
    }

    end++
  }

  if (end === start) {
    return null
  }

  return {
    value: Number(input.slice(start, end)),
    end,
  }
}

function parseMul(input: string, start: number): Parsed | null {
  const lhs = readNumber(input, start + 'mul('.length)

  if (!lhs || input[lhs.end] !== ',') {
    return null
  }

  const rhs = readNumber(input, lhs.end + 1)

  if (!rhs || input[rhs.end] !== ')') {
    return null
  }

  return {
    operation: {
      type: 'mul',
      lhs: lhs.value,
      rhs: rhs.value,
    },
    end: rhs.end + 1,
  }
}

function parseOperations(input: string): Operation[] {
  const operations: Operation[] = []
  let cursor = 0

  while (cursor < input.length) {
    if (input.startsWith('mul(', cursor)) {
      const parsed = parseMul(input, cursor)

      if (parsed) {
        operations.push(parsed.operation)
        cursor = parsed.end
        continue
      }
    } else if (input.startsWith('do()', cursor)) {
      operations.push({ type: 'do' })
      cursor += 'do()'.length
      continue
    } else if (input.startsWith("don't()", cursor)) {
      operations.push({ type: 'dont' })
      cursor += "don't()".length
      continue
    }

    cursor++
  }

  return operations
}

export function one(input: string): number {
  let answer = 0

  for (const op of parseOperations(input)) {
    if (op.type === 'mul') {
      answer += op.lhs * op.rhs
    }
  }

  return answer
}

export function two(input: string): number {
  let isSkipping = false
  let answer = 0

  for (const op of parseOperations(input)) {
    switch (op.type) {
      case 'do': {
        isSkipping = false
        break
      }

      case 'dont': {
        isSkipping = true
        break
      }

      case 'mul': {
        if (!isSkipping) {
          answer += op.lhs * op.rhs
        }
      }
    }
  }

  return answer
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/3/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
