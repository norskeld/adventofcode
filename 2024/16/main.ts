import { BinaryHeap } from '@std/data-structures'

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

const enum Direction {
  Up,
  Right,
  Down,
  Left,
}

interface Maze {
  cells: Cell[][]
  start: Coord
  end: Coord
}

interface State {
  row: number
  col: number
  direction: Direction
}

interface Step {
  state: State
  cost: number
}

interface HeapEntry<T> {
  value: T
  priority: number
}

interface SearchOptions {
  reversed?: boolean
  isGoal?: (state: State) => boolean
}

const DIRECTIONS: Coord[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

const ALL_DIRECTIONS: Direction[] = [
  Direction.Up,
  Direction.Right,
  Direction.Down,
  Direction.Left,
]

const MOVE_COST = 1
const TURN_COST = 1000

function parseMaze(input: string): Maze {
  let start: Coord = [0, 0]
  let end: Coord = [0, 0]

  const cells: Cell[][] = input
    .trim()
    .split('\n')
    .map((line, row) =>
      [...line].map((char, col) => {
        if (char === 'S') return (start = [row, col], Cell.Start)
        if (char === 'E') return (end = [row, col], Cell.End)
        if (char === '#') return Cell.Wall
        return Cell.Empty
      })
    )

  return {
    cells,
    start,
    end,
  }
}

function key({ row, col, direction }: State): string {
  return `${row}:${col}:${direction}`
}

function manhattan([row, col]: Coord, [targetRow, targetCol]: Coord): number {
  return Math.abs(row - targetRow) + Math.abs(col - targetCol)
}

function startState(maze: Maze): State {
  return {
    row: maze.start[0],
    col: maze.start[1],
    direction: Direction.Right,
  }
}

function endStates(maze: Maze): State[] {
  return ALL_DIRECTIONS.map((direction) => ({
    row: maze.end[0],
    col: maze.end[1],
    direction,
  }))
}

function byPriority<T>(a: HeapEntry<T>, b: HeapEntry<T>): number {
  return a.priority - b.priority
}

function neighbors(maze: Maze, state: State, reversed: boolean): Step[] {
  const rows = maze.cells.length
  const cols = maze.cells[0].length
  const { row, col, direction } = state

  const steps: Step[] = []

  const [dr, dc] = DIRECTIONS[direction]
  const sign = reversed ? -1 : 1
  const nextRow = row + sign * dr
  const nextCol = col + sign * dc

  if (
    nextRow >= 0 && nextRow < rows &&
    nextCol >= 0 && nextCol < cols &&
    maze.cells[nextRow][nextCol] !== Cell.Wall
  ) {
    steps.push({
      state: { row: nextRow, col: nextCol, direction },
      cost: MOVE_COST,
    })
  }

  steps.push({
    state: { row, col, direction: (direction + 3) % 4 as Direction },
    cost: TURN_COST,
  })

  steps.push({
    state: { row, col, direction: (direction + 1) % 4 as Direction },
    cost: TURN_COST,
  })

  return steps
}

/**
 * A* search over states. Returns the cost of the cheapest path from the sources
 * to every reached state. With a 0 heuristuc this is plain Dijkstra (I think?),
 * and the `isGoal` option lets it stop as soon as a goal is settled.
 */
function search(
  maze: Maze,
  sources: State[],
  heuristic: (state: State) => number,
  options: SearchOptions = {},
): Map<string, number> {
  const reversed = options.reversed ?? false

  const open: BinaryHeap<HeapEntry<State>> = new BinaryHeap(byPriority)
  const distances: Map<string, number> = new Map()
  const visited: Set<string> = new Set()

  for (const source of sources) {
    distances.set(key(source), 0)

    open.push({
      value: source,
      priority: heuristic(source),
    })
  }

  while (!open.isEmpty()) {
    const current = open.pop()!.value
    const currentKey = key(current)

    if (visited.has(currentKey)) {
      continue
    }

    visited.add(currentKey)

    if (options.isGoal?.(current)) {
      return distances
    }

    const currentCost = distances.get(currentKey)!

    for (const { state, cost } of neighbors(maze, current, reversed)) {
      const nextKey = key(state)
      const nextCost = currentCost + cost
      const known = distances.get(nextKey)

      if (known !== undefined && known <= nextCost) {
        continue
      }

      distances.set(nextKey, nextCost)

      open.push({
        value: state,
        priority: nextCost + heuristic(state),
      })
    }
  }

  return distances
}

export function one(input: string): number {
  const maze = parseMaze(input)

  const distances = search(
    maze,
    [startState(maze)],
    (state) => manhattan([state.row, state.col], maze.end),
    {
      isGoal: (state) => state.row === maze.end[0] && state.col === maze.end[1],
    },
  )

  return Math.min(
    ...endStates(maze).map((state) => distances.get(key(state)) ?? Infinity),
  )
}

export function two(input: string): number {
  const maze = parseMaze(input)

  // Cheapest cost from the start to every state.
  const fromStart = search(
    maze,
    [startState(maze)],
    (state) => manhattan([state.row, state.col], maze.end),
  )

  // Cheapest cost from every state to the end, found by walking the edges
  // backwards from the end states.
  const toEnd = search(
    maze,
    endStates(maze),
    (state) => manhattan([state.row, state.col], maze.start),
    { reversed: true },
  )

  const best = Math.min(
    ...endStates(maze).map((state) => fromStart.get(key(state)) ?? Infinity),
  )

  let tiles = 0

  for (const [row, cells] of maze.cells.entries()) {
    for (const [col, cell] of cells.entries()) {
      if (cell === Cell.Wall) {
        continue
      }

      // A tile belongs to some best path if any orientation of it lies on one.
      const onBestPath = ALL_DIRECTIONS.some((direction) => {
        const stateKey = key({ row, col, direction })
        const from = fromStart.get(stateKey)
        const to = toEnd.get(stateKey)

        return from !== undefined && to !== undefined && from + to === best
      })

      if (onBestPath) {
        tiles++
      }
    }
  }

  return tiles
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/16/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
