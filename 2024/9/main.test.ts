import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/9/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 1928)
})

Deno.test('two', () => {
  assertEquals(two(sample), 2858)
})
