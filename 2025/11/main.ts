function parseServerMap(input: string): Map<string, string[]> {
  const map: Map<string, string[]> = new Map()

  for (const line of input.trim().split('\n')) {
    const [server, connections] = line.split(':').map((it) => it.trim())
    const refs = connections.split(' ')

    map.set(server, refs)
  }

  return map
}

function findPathsCount(
  map: Map<string, string[]>,
  start: string,
  target: string,
  requiredNodes: string[],
): number {
  const required = new Set(requiredNodes)
  const memo = new Map<string, number>()

  function traverse(
    node: string,
    visitedRequired: Set<string>,
    pathNodes: Set<string>,
  ): number {
    // Cycle detection: avoid revisiting nodes in the same path.
    if (pathNodes.has(node)) {
      return 0
    }

    // Update visited required nodes if current node is required.
    const newVisitedRequired = required.has(node)
      ? new Set(visitedRequired).add(node)
      : visitedRequired

    // Check if we reached the target with all required nodes.
    if (node === target) {
      return newVisitedRequired.size === required.size ? 1 : 0
    }

    // Create memoization key.
    const sortedRequired = Array.from(newVisitedRequired).sort().join(',')
    const memoKey = `${node}:${sortedRequired}`

    if (memo.has(memoKey)) {
      return memo.get(memoKey)!
    }

    // Add current node to path.
    const newPath = new Set(pathNodes).add(node)
    const neighbors = map.get(node) ?? []

    let count = 0

    for (const neighbor of neighbors) {
      count += traverse(neighbor, newVisitedRequired, newPath)
    }

    memo.set(memoKey, count)
    return count
  }

  return traverse(start, new Set(), new Set())
}

export function one(input: string): number {
  const map = parseServerMap(input)
  const count = findPathsCount(map, 'you', 'out', [])

  return count
}

export function two(input: string): number {
  const map = parseServerMap(input)
  const count = findPathsCount(map, 'svr', 'out', ['dac', 'fft'])

  return count
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/11/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
