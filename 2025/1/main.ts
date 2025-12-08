function parseRotations(line: string): number {
  const sign = line.at(0) === 'L' ? -1 : 1
  const rotations = parseInt(line.substring(1)) * sign

  return rotations
}

export function one(input: string): number {
  let pointer = 50
  let zeros = 0

  for (const line of input.trim().split('\n')) {
    const rotations = parseRotations(line)
    const next = (pointer + rotations + 100) % 100

    zeros += Number(next === 0)
    pointer = next
  }

  return zeros
}

export function two(input: string): number {
  let pointer = 50
  let zeros = 0

  for (const line of input.trim().split('\n')) {
    const rotations = parseRotations(line)
    const next = (pointer + rotations + 100) % 100

    zeros += rotations > 0
      ? Math.floor((pointer + rotations) / 100) - Math.floor(pointer / 100)
      : Math.floor((pointer - 1) / 100) -
        Math.floor((pointer - 1 + rotations) / 100)

    pointer = next
  }

  return zeros
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/1/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
