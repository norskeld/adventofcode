import { assert } from '@std/assert'

interface Point {
  x: number
  y: number
  z: number
}

interface Pair {
  distance: number
  left: number
  right: number
}

/**
 * Union-Find with path compression and union by rank for efficient connected
 * component tracking.
 */
class UnionFind {
  private parent: number[]
  private rank: number[]

  /** Initially each element is its own parent (isolated component). */
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = new Array(n).fill(0)
  }

  /** Flattens the tree by making nodes point directly to root. */
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x])
    }

    return this.parent[x]
  }

  /** Attaches smaller tree under root of larger tree to keep trees balanced. */
  union(x: number, y: number): void {
    // Find roots of both elements.
    const rootX = this.find(x)
    const rootY = this.find(y)

    // Skip if same root.
    if (rootX === rootY) return

    // Attach smaller tree under larger one based on rank (tree height).
    // If rootX has lower rank, attach it under rootY.
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY
    } // If rootX has higher rank, attach rootY under it.
    else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX
    } // Otherwise ranks are equal, so pick one arbitrarily and increment rank.
    else {
      this.parent[rootY] = rootX
      this.rank[rootX]++
    }
  }

  /**
   * Counts elements in each connected component by grouping nodes by their
   * root.
   */
  getCircuitSizes(): number[] {
    const sizes = new Map<number, number>()

    for (let idx = 0; idx < this.parent.length; idx++) {
      const root = this.find(idx)
      const size = sizes.get(root) ?? 0

      sizes.set(root, size + 1)
    }

    return Array.from(sizes.values())
  }
}

/**
 * Square root is expensive, so we use just squared distance for comparisons and
 * sorting.
 */
function squaredEuclideanDistance(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z

  return dx * dx + dy * dy + dz * dz
}

/**
 * Generate all unique pairs of boxes with their distances, sorted by distance
 * (shortest first).
 *
 * This is O(n^2) but kinda necessary for the greedy MST-like approach?
 */
function findAllPairs(boxes: Point[]): Pair[] {
  const pairs: Pair[] = []
  const length = boxes.length

  for (let left = 0; left < length; left++) {
    for (let right = left + 1; right < length; right++) {
      const distance = squaredEuclideanDistance(boxes[left], boxes[right])

      pairs.push({
        distance,
        left,
        right,
      })
    }
  }

  return pairs.sort((a, b) => a.distance - b.distance)
}

function parseBoxes(input: string): Point[] {
  return input.trim().split('\n').map((line) => {
    const [x, y, z] = line.split(',').map(Number)
    return { x, y, z }
  })
}

export function one(input: string, maxConnections = 1_000): number {
  const boxes = parseBoxes(input)
  const pairs = findAllPairs(boxes)

  // Here we connect boxes greedily by shortest distance up to maxConnections
  // edges and then return the product of the three largest cluster sizes.
  const uf = new UnionFind(boxes.length)

  let connections = 0

  // Greedily add edges.
  for (const { left, right } of pairs) {
    uf.union(left, right)
    connections++

    if (connections === maxConnections) {
      break
    }
  }

  const [fst, snd, trd] = uf.getCircuitSizes().sort((a, b) => b - a)

  return fst * snd * trd
}

export function two(input: string): number {
  const boxes = parseBoxes(input)
  const pairs = findAllPairs(boxes)

  // And here we basically build an MST (Minimum Spanning Tree) using Kruskal's
  // algorithm  until all boxes form one connected component.
  const uf = new UnionFind(boxes.length)

  // Start with n isolated components (one per box).
  let circuits = boxes.length
  let last: Pair | null = null

  for (const pair of pairs) {
    const { left, right } = pair

    // Only add edge if it merges two different components.
    if (uf.find(left) !== uf.find(right)) {
      uf.union(left, right)
      circuits--
      last = pair

      // Stop when all boxes are connected into a single component.
      if (circuits === 1) {
        break
      }
    }
  }

  // You can never be sure...
  assert(last !== null)

  // And finally return the product of x-coordinates of the two boxes connected
  // by the last (longest) edge.
  return boxes[last.left].x * boxes[last.right].x
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/8/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
