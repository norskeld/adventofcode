interface Point {
  x: number
  y: number
}

interface Range {
  min: number
  max: number
}

function parsePoints(input: string): Point[] {
  return input.trim().split('\n').map((line) => {
    const [x, y] = line.split(',').map(Number)
    return { x, y }
  })
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
  const byX = new Map<number, number[]>()
  const byY = new Map<number, number[]>()

  for (const p of points) {
    if (!byX.has(p.x)) byX.set(p.x, [])
    byX.get(p.x)!.push(p.y)

    if (!byY.has(p.y)) byY.set(p.y, [])
    byY.get(p.y)!.push(p.x)
  }

  // Build row ranges (min/max x per y).
  const rowRanges = new Map<number, Range>()

  for (const [x, ys] of byX) {
    if (ys.length < 2) continue

    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    for (let y = minY; y <= maxY; y++) {
      const range = rowRanges.get(y)

      if (range) {
        range.min = Math.min(range.min, x)
        range.max = Math.max(range.max, x)
      } else {
        rowRanges.set(y, {
          min: x,
          max: x,
        })
      }
    }
  }

  for (const [y, xs] of byY) {
    if (xs.length < 2) continue

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)

    const range = rowRanges.get(y)

    if (range) {
      range.min = Math.min(range.min, minX)
      range.max = Math.max(range.max, maxX)
    } else {
      rowRanges.set(y, {
        min: minX,
        max: maxX,
      })
    }
  }

  // Check all pairs of RED points only.
  let maxArea = 0

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]

    for (let j = i + 1; j < points.length; j++) {
      const p2 = points[j]

      const minX = Math.min(p1.x, p2.x)
      const maxX = Math.max(p1.x, p2.x)
      const minY = Math.min(p1.y, p2.y)
      const maxY = Math.max(p1.y, p2.y)

      // Quick area check before expensive validation.
      const area = (maxX - minX + 1) * (maxY - minY + 1)
      if (area <= maxArea) continue

      // Check if rectangle fits within marked bounds for all rows.
      let valid = true

      for (let y = minY; y <= maxY && valid; y++) {
        const range = rowRanges.get(y)

        if (!range || minX < range.min || maxX > range.max) {
          valid = false
        }
      }

      if (valid) {
        maxArea = area
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
