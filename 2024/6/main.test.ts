import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/6/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 41)
})

Deno.test('two', () => {
  assertEquals(two(sample), 6)
})
