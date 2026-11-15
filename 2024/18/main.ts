import { Deque } from '@std/data-structures'

type Coord = [
  row: number,
  col: number,
]

const enum Cell {
  Empty,
  Wall,
  Start,
  End,
}

interface Maze {
  cells: Cell[][]
  start: Coord
  end: Coord
}

const DIRECTIONS: Coord[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

function parseBytes(input: string, limit = Infinity): Coord[] {
  return input
    .trim()
    .split('\n')
    .slice(0, limit)
    .map((line) =>
      line
        .split(',')
        .map(Number) as Coord
    )
}

function buildMaze(bytes: Coord[], size: number): Maze {
  const cells: Cell[][] = Array.from(
    { length: size + 1 },
    (_) => Array(size + 1).fill(Cell.Empty),
  )

  for (const [br, bc] of bytes) {
    cells[br][bc] = Cell.Wall
  }

  cells[0][0] = Cell.Start
  cells[size][size] = Cell.End

  return {
    cells,
    start: [0, 0],
    end: [size, size],
  }
}

function search(maze: Maze): number {
  const rows = maze.cells.length
  const cols = maze.cells[0].length

  const distances: number[][] = Array.from(
    { length: rows },
    (_) => Array(cols).fill(-1),
  )

  const queue: Deque<Coord> = new Deque()
  const [sr, sc] = maze.start

  distances[sr][sc] = 0
  queue.pushBack(maze.start)

  while (!queue.isEmpty()) {
    const [row, col] = queue.popFront()!
    const [er, ec] = maze.end
    const distance = distances[row][col]

    if (row === er && col === ec) {
      return distance
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr
      const nc = col + dc

      if (
        nr < 0 || nr >= rows || nc < 0 || nc >= cols ||
        maze.cells[nr][nc] === Cell.Wall ||
        distances[nr][nc] !== -1
      ) {
        continue
      }

      distances[nr][nc] = distance + 1
      queue.pushBack([nr, nc])
    }
  }

  return -1
}

export function one(input: string, size: number, limit: number): number {
  const bytes = parseBytes(input, limit)
  const maze = buildMaze(bytes, size)
  return search(maze)
}

/**
 * Here we need to find the first byte that blocks the exit.
 *
 * Each byte only adds a wall, so once the exit is blocked it stays blocked.
 * That means there's a single point where the maze flips from solvable to
 * unsolvable.
 *
 * Binary search finds that point in O(log n) maze checks, which is fast enough.
 */
export function two(input: string, size: number): string {
  const bytes = parseBytes(input)

  let low = 0
  let high = bytes.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const maze = buildMaze(bytes.slice(0, mid), size)

    if (search(maze) === -1) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  const coord = bytes[low - 1]

  return coord.join(',')
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/18/input.txt')

  console.log([
    one(input, 70, 1024),
    two(input, 70),
  ])
}
