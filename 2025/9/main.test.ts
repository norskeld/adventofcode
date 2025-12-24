import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/9/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 50)
})

Deno.test('two', () => {
  assertEquals(two(sample), 24)
})
