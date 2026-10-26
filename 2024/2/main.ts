function parseReports(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map((report) =>
      report
        .split(' ')
        .map(Number)
    )
}

function isSafe(report: number[]): boolean {
  let isIncreasing = true
  let isDecreasing = true

  for (let curr = 0, next = 1; next < report.length; curr++, next++) {
    if (report[curr] > report[next]) isIncreasing = false
    if (report[curr] < report[next]) isDecreasing = false

    if (!isIncreasing && !isDecreasing) {
      return false
    }

    const diff = Math.abs(report[next] - report[curr])

    if (diff >= 1 && diff <= 3) {
      continue
    } else {
      return false
    }
  }

  return true
}

function isSafeWithDampener(report: number[]): boolean {
  if (isSafe(report)) {
    return true
  }

  for (let idx = 0; idx < report.length; idx++) {
    if (isSafe(report.toSpliced(idx, 1))) {
      return true
    }
  }

  return false
}

export function one(input: string): number {
  return parseReports(input).reduce(
    (acc, report) => acc + (isSafe(report) ? 1 : 0),
    0,
  )
}

export function two(input: string): number {
  return parseReports(input).reduce(
    (acc, report) => acc + (isSafeWithDampener(report) ? 1 : 0),
    0,
  )
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/2/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
