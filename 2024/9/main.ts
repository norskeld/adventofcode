interface FileBlock {
  type: 'file'
  id: number
  size: number
  pos: number
}

interface FreeBlock {
  type: 'free'
  size: number
  pos: number
}

type Block = FileBlock | FreeBlock

function parseBlocks(input: string): Block[] {
  const diskmap = input.trim().split('').map(Number)
  const blocks: Block[] = []

  for (let idx = 0, fileId = 0, pos = 0; idx < diskmap.length; idx++) {
    const size = diskmap[idx]

    if (idx % 2 === 0) {
      if (size > 0) {
        blocks.push({
          type: 'file',
          id: fileId,
          size,
          pos,
        })
      }

      fileId++
    } else if (size > 0) {
      blocks.push({
        type: 'free',
        size,
        pos,
      })
    }

    pos += size
  }

  return blocks
}

function span(id: number, pos: number, size: number): number {
  return id * (size * pos + (size * (size - 1)) / 2)
}

export function one(input: string): number {
  const sizes = input.trim().split('').map(Number)

  let pos = 0
  let checksum = 0
  let right = sizes.length - 1

  if (right % 2 === 1) {
    right--
  }

  for (let left = 0; left <= right; left++) {
    if (left % 2 === 0) {
      checksum += span(left / 2, pos, sizes[left])
      pos += sizes[left]

      continue
    }

    let free = sizes[left]

    while (free > 0 && right > left) {
      const take = Math.min(free, sizes[right])

      checksum += span(right / 2, pos, take)
      pos += take
      free -= take
      sizes[right] -= take

      if (sizes[right] === 0) {
        right -= 2
      }
    }
  }

  return checksum
}

export function two(input: string): number {
  const blocks = parseBlocks(input)

  const files: FileBlock[] = blocks.filter((it) => it.type === 'file')
  const free: FreeBlock[] = blocks.filter((it) => it.type === 'free')

  for (let idx = files.length - 1; idx >= 0; idx--) {
    const file = files[idx]

    while (free.length > 0 && free[free.length - 1].pos >= file.pos) {
      free.pop()
    }

    for (const span of free) {
      if (span.size < file.size) {
        continue
      }

      file.pos = span.pos
      span.pos += file.size
      span.size -= file.size

      break
    }
  }

  let checksum = 0

  for (const file of files) {
    for (let k = 0; k < file.size; k++) {
      checksum += (file.pos + k) * file.id
    }
  }

  return checksum
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/9/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
