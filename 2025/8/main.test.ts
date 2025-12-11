import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/8/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample, 10), 40)
})

Deno.test('two', () => {
  assertEquals(two(sample), 25272)
})
