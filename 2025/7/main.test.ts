import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/7/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 21)
})

Deno.test('two', () => {
  assertEquals(two(sample), 40)
})
