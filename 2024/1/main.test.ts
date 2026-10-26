import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/1/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 11)
})

Deno.test('two', () => {
  assertEquals(two(sample), 31)
})
