import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample1 = Deno.readTextFileSync('2024/15/sample-1.txt')
const sample2 = Deno.readTextFileSync('2024/15/sample-2.txt')

Deno.test('one', () => {
  assertEquals(one(sample1), 2028)
})

Deno.test('two', () => {
  assertEquals(two(sample2), 9021)
})
