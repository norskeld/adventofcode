import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/13/sample.txt')

Deno.test('one', () => {
  assertEquals(one(sample), 480)
})

Deno.test('two', () => {
  assertEquals(two(sample), 875318608908)
})
