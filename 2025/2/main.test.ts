import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/2/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 1227775554)
})

Deno.test('two', () => {
  assertEquals(two(sample), 4174379265)
})
