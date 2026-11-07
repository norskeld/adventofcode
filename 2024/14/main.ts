interface Coord {
  x: number
  y: number
}

interface Move {
  position: Coord
  velocity: Coord
}

const COORD_RE = /\w+=(-?\d+),(-?\d+)/

function parsePositions(input: string): Move[] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [position, velocity] = line
        .split(' ')
        .map<Coord>((part) => {
          const [, x, y] = part.match(COORD_RE)!

          return {
            x: Number(x),
            y: Number(y),
          }
        })

      return {
        position,
        velocity,
      }
    })
}

function getQuadrant({ x, y }: Coord, [mx, my]: [number, number]): number {
  if (x === mx || y === my) return 0

  if (x > mx && y < my) return 1 // Top-Right
  if (x < mx && y < my) return 2 // Top-Left
  if (x < mx && y > my) return 3 // Bottom-Left
  if (x > mx && y > my) return 4 // Bottom-Right

  return 0
}

function step(moves: Move[], [w, h]: [number, number]): void {
  for (const move of moves) {
    const npx = move.position.x + move.velocity.x
    const npy = move.position.y + move.velocity.y

    if (npx < 0) move.position.x = w + npx
    else if (npx >= w) move.position.x = Math.abs(w - npx)
    else move.position.x = npx

    if (npy < 0) move.position.y = h + npy
    else if (npy >= h) move.position.y = Math.abs(h - npy)
    else move.position.y = npy
  }
}

function hasRun(robots: Set<string>, length: number): boolean {
  for (const robot of robots) {
    const [x, y] = robot.split(',').map(Number)

    let run = 1

    for (let i = 1; i < length; i++) {
      if (!robots.has(`${x + i},${y}`)) {
        break
      }

      run++
    }

    if (run >= length) {
      return true
    }
  }

  return false
}

function render(robots: Set<string>, [w, h]: [number, number]): string {
  const rows: string[] = []

  for (let y = 0; y < h; y++) {
    let row = ''

    for (let x = 0; x < w; x++) {
      row += robots.has(`${x},${y}`) ? '█' : ' '
    }

    rows.push(row)
  }

  return rows.join('\n')
}

export function one(input: string, [w, h]: [number, number]): number {
  const moves = parsePositions(input)
  const mx = (w - 1) / 2
  const my = (h - 1) / 2

  const quadrants: Map<number, number> = new Map()

  for (let s = 1; s <= 100; s++) {
    step(moves, [w, h])
  }

  for (const { position } of moves) {
    const quadrant = getQuadrant(position, [mx, my])

    if (quadrant) {
      quadrants.set(quadrant, (quadrants.get(quadrant) ?? 0) + 1)
    }
  }

  return quadrants.values().reduce((acc, n) => acc * n)
}

export function two(input: string, [w, h]: [number, number]): number {
  const moves = parsePositions(input)

  for (let s = 1; s <= w * h; s++) {
    step(moves, [w, h])

    const robots = new Set(
      moves.map(({ position }) => `${position.x},${position.y}`),
    )

    if (hasRun(robots, 10)) {
      console.log(render(robots, [w, h]))
      return s
    }
  }

  return 0
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/14/input.txt')

  console.log([
    one(input, [101, 103]),
    two(input, [101, 103]),
  ])
}
