import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/11/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 55312)
})

Deno.test('two', () => {
  assertEquals(two(sample), 65601038650482.)
})
