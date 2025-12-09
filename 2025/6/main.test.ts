import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2025/6/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 4277556)
})

Deno.test('two', () => {
  assertEquals(two(sample), 3263827)
})
