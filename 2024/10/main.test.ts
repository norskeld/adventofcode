import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/10/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 36)
})

Deno.test('two', () => {
  assertEquals(two(sample), 81)
})
