import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/8/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 14)
})

Deno.test('two', () => {
  assertEquals(two(sample), 34)
})
