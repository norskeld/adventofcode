import { join } from '@std/path'

interface SolutionEntry {
  main: string
  input: string
}

async function findValidSolutions(year: string): Promise<SolutionEntry[]> {
  const solutions: SolutionEntry[] = []

  for await (const entry of Deno.readDir(year)) {
    if (entry.isDirectory) {
      const dirPath = join(year, entry.name)
      const mainPath = join(dirPath, 'main.ts')
      const inputPath = join(dirPath, 'input.txt')

      try {
        const main = await Deno.lstat(mainPath)
        const input = await Deno.lstat(inputPath)

        if (main.isFile && input.isFile) {
          solutions.push({
            main: mainPath,
            input: inputPath,
          })
        }
      } catch {
        // Simply skip
      }
    }
  }

  return solutions
}

async function withTiming<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  return [result, duration]
}

export async function runAll([year]: string[]): Promise<void> {
  // Find all valid solutions to run
  const solutions = await findValidSolutions(year)

  // Run all solutions and collect results with timings
  console.log(`Running ${year} solutions...`)

  for (const solution of solutions) {
    const [output, duration] = await withTiming(() =>
      new Deno.Command('deno', {
        args: ['run', '--allow-read', solution.main, solution.input],
        stdout: 'piped',
      }).output()
    )

    const text = new TextDecoder().decode(output.stdout)

    const path = solution.main.substring(
      0,
      solution.main.indexOf('main.ts') - 1,
    )

    console.log(`  Solution ${path} | ${Math.round(duration)}ms`)
    console.log(`    ${text}`)
  }
}
