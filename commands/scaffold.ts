import { dedent } from '@std/text/unstable-dedent'

const genMainTemplate = (year: string, day: string) =>
  dedent`
    export function one(input: string): number {
      return 0
    }

    export function two(input: string): number {
      return 0
    }

    if (import.meta.main) {
      const input = Deno.readTextFileSync('${year}/${day}/input.txt')

      console.log([
        one(input),
        two(input),
      ])
    }
  `

const genTestTemplate = (year: string, day: string) =>
  dedent`
    import { assertEquals } from '@std/assert'

    import { one, two } from './main.ts'

    const sample = Deno.readTextFileSync('${year}/${day}/sample.txt')

    Deno.test('one', () => {
      assertEquals(one(sample), 0)
    })

    Deno.test('two', () => {
      assertEquals(two(sample), 0)
    })
  `

export async function scaffold([year, day]: string[]): Promise<void> {
  const path = `./${year}/${day}`

  await Deno.mkdir(path, {
    recursive: true,
  })

  const files = [
    ['main.ts', genMainTemplate(year, day)],
    ['main.test.ts', genTestTemplate(year, day)],
    ['sample.txt', '\n'],
    ['input.txt', '\n'],
  ]

  for (const [file, contents] of files) {
    await Deno.writeTextFile(`${path}/${file}`, contents)
  }

  console.log(`Scaffoled ${year}/${day} stuff`)
}
