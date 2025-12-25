import { assert } from '@std/assert'

interface Region {
  width: number
  height: number
  quantities: number[]
}

interface State {
  shapes: number[]
  regions: Region[]
}

function parseState(input: string): State {
  const chunks = input.trim().split('\n\n')

  const shapes: number[] = chunks.slice(0, chunks.length - 1)
    .map((chunk) => {
      const [, shapeRaw] = chunk.split(':').map((it) => it.trim())
      const shape = shapeRaw.split('').filter((ch) => ch === '#').length

      return shape
    })

  const regions: Region[] = (chunks.at(-1)?.split('\n') ?? [])
    .map((line) => {
      const [dimensionsRaw, quantitiesRaw] = line
        .split(':')
        .map((it) => it.trim())

      const [width, height] = dimensionsRaw.split('x').map(Number)
      const quantities = quantitiesRaw.split(' ').map(Number)

      return {
        width,
        height,
        quantities,
      }
    })

  return {
    shapes,
    regions,
  }
}

function isTriviallyPossible(region: Region): boolean {
  const shapesTotal = region.quantities.reduce((acc, n) => acc + n, 0)

  const width = Math.trunc(region.width / 3)
  const height = Math.trunc(region.height / 3)

  return width * height >= shapesTotal
}

function isTriviallyImpossible(region: Region, shapes: number[]): boolean {
  const shapeArea = region.quantities
    .map((n, i) => shapes[i] * n)
    .reduce((acc, n) => acc + n, 0)

  return region.width * region.height < shapeArea
}

export function one(input: string): number {
  const { shapes, regions } = parseState(input)
  let count = 0

  for (const region of regions) {
    if (isTriviallyPossible(region)) {
      count++
    } else {
      assert(isTriviallyImpossible(region, shapes))
    }
  }

  return count
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2025/12/input.txt')

  console.log([
    one(input),
  ])
}
