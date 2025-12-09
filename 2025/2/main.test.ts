import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/2/sample.txt')

Deno.test('2025/2/one', () => {
  assertEquals(one(sample), 1227775554)
})

Deno.test('2025/2/two', () => {
  assertEquals(two(sample), 4174379265)
})
