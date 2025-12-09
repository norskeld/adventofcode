import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/4/sample.txt')

Deno.test('2025/4/one', () => {
  assertEquals(one(sample), 13)
})

Deno.test('2025/4/two', () => {
  assertEquals(two(sample), 43)
})
