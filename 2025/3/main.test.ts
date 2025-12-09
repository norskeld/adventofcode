import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/3/sample.txt')

Deno.test('2025/3/one', () => {
  assertEquals(one(sample), 357)
})

Deno.test('2025/3/two', () => {
  assertEquals(two(sample), 3121910778619)
})
