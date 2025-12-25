import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample1 = Deno.readTextFileSync('2025/11/sample-1.txt')
const sample2 = Deno.readTextFileSync('2025/11/sample-2.txt')

Deno.test('one', () => {
  assertEquals(one(sample1), 5)
})

Deno.test('two', () => {
  assertEquals(two(sample2), 2)
})
