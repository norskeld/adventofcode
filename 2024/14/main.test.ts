import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample = Deno.readTextFileSync('2024/14/sample.txt')
const input = Deno.readTextFileSync('2024/14/input.txt')

Deno.test('one', () => {
  assertEquals(one(sample, [11, 7]), 12)
})

Deno.test('two', () => {
  assertEquals(two(input, [101, 103]), 7623)
})
