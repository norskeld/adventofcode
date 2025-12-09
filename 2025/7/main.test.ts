import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/7/sample.txt')

Deno.test('2025/7/one', () => {
  assertEquals(one(sample), 21)
})

Deno.test('2025/7/two', () => {
  assertEquals(two(sample), 40)
})
