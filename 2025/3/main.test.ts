import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/3/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 357)
})

Deno.test('two', () => {
  assertEquals(two(sample), 3121910778619)
})
