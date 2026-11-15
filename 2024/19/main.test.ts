import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/19/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 6)
})

Deno.test('two', () => {
  assertEquals(two(sample), 16)
})
