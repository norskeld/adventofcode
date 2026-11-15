import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/18/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample, 6, 12), 22)
})

Deno.test('two', () => {
  assertEquals(two(sample), 0)
})
