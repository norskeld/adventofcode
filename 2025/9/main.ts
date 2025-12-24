class Point {
  constructor(public x: number, public y: number) {}

  static fromCoords([x, y]: number[]): Point {
    return new Point(x, y)
  }

  static fromKey(key: string): Point {
    return Point.fromCoords(key.split(':').map(Number))
  }

  asKey(): string {
    return `${this.x}:${this.y}`
  }
}

class Distance {
  constructor(public min: number, public max: number) {}
}

function parsePoints(input: string): Point[] {
  return input.trim().split('\n').map((line) =>
    Point.fromCoords(line.split(',').map(Number))
  )
}

function calculateArea(p1: Point, p2: Point): number {
  const dx = Math.abs(p2.x - p1.x) + 1
  const dy = Math.abs(p2.y - p1.y) + 1

  return dx * dy
}

function checkArea(
  distances: Map<number, Distance>,
  p1: Point,
  p2: Point,
): boolean {
  const minX = Math.min(p1.x, p2.x)
  const minY = Math.min(p1.y, p2.y)
  const maxX = Math.max(p1.x, p2.x)
  const maxY = Math.max(p1.y, p2.y)

  for (let y = minY; y <= maxY; y++) {
    const distance = distances.get(y)

    if (!distance || minX < distance.min || maxX > distance.max) {
      return false
    }
  }

  return true
}

function findMaxArea(points: Point[]): number {
  let maxArea = 0

  for (let idx = 0; idx < points.length; idx++) {
    const point = points[idx]

    for (let otherIdx = idx + 1; otherIdx < points.length; otherIdx++) {
      const other = points[otherIdx]

      if (point.x === other.x && point.y === other.y) {
        continue
      }

      const distanceX = Math.abs(point.x - other.x) + 1
      const distanceY = Math.abs(point.y - other.y) + 1

      maxArea = Math.max(maxArea, distanceX * distanceY)
    }
  }

  return maxArea
}

function findMaxAreaConstrained(points: Point[]): number {
  let maxArea = 0

  const redPoints = new Set<string>()
  const redPointInX = new Map<number, Point[]>()
  const redPointInY = new Map<number, Point[]>()
  const markedPoints = new Set<string>()
  const markedPointInY = new Map<number, Point[]>()

  for (const point of points) {
    redPoints.add(point.asKey())

    if (!redPointInX.has(point.x)) redPointInX.set(point.x, [])
    redPointInX.get(point.x)!.push(point)

    if (!redPointInY.has(point.y)) redPointInY.set(point.y, [])
    redPointInY.get(point.y)!.push(point)
  }

  for (const key of redPoints) {
    const p1 = Point.fromKey(key)

    for (const p2 of redPointInX.get(p1.x) ?? []) {
      if (p1.x !== p2.x || p1.y !== p2.y) {
        const minY = Math.min(p1.y, p2.y)
        const maxY = Math.max(p1.y, p2.y)

        for (let py = minY; py <= maxY; py++) {
          const point = new Point(p1.x, py)
          markedPoints.add(point.asKey())

          if (!markedPointInY.has(py)) markedPointInY.set(py, [])
          markedPointInY.get(py)!.push(point)
        }
      }
    }

    for (const p2 of redPointInY.get(p1.y) ?? []) {
      if (p1.x !== p2.x || p1.y !== p2.y) {
        const minX = Math.min(p1.x, p2.x)
        const maxX = Math.max(p1.x, p2.x)

        for (let px = minX; px <= maxX; px++) {
          const point = new Point(px, p1.y)
          markedPoints.add(point.asKey())

          if (!markedPointInY.has(p1.y)) markedPointInY.set(p1.y, [])
          markedPointInY.get(p1.y)!.push(point)
        }
      }
    }
  }

  const distances = new Map<number, Distance>()
  for (const [y, points] of markedPointInY) {
    if (points.length < 2) continue

    let minX = Infinity
    let maxX = 0

    for (const point of points) {
      if (point.x < minX) minX = point.x
      if (point.x > maxX) maxX = point.x
    }

    distances.set(y, new Distance(minX, maxX))
  }

  const redPointsList: Point[] = [...redPoints].map((key) => Point.fromKey(key))
  for (const p1 of redPointsList) {
    for (const p2 of redPointsList) {
      if (p1.x !== p2.x || p1.y !== p2.y) {
        const area = calculateArea(p1, p2)

        if (area > maxArea && checkArea(distances, p1, p2)) {
          maxArea = area
        }
      }
    }
  }

  return maxArea
}

export function one(input: string): number {
  const coords = parsePoints(input)
  const maxArea = findMaxArea(coords)
  return maxArea
}

export function two(input: string): number {
  const coords = parsePoints(input)
  const maxArea = findMaxAreaConstrained(coords)
  return maxArea
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/9/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
