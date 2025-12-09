import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/5/sample.txt')

Deno.test('2025/5/one', () => {
  assertEquals(one(sample), 3)
})

Deno.test('2025/5/two', () => {
  assertEquals(two(sample), 14)
})
