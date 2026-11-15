import { assertEquals } from '@std/assert'

import { one, two } from './main.ts'

const sample1 = Deno.readTextFileSync('2024/17/sample-1.txt')
const sample2 = Deno.readTextFileSync('2024/17/sample-2.txt')

Deno.test('one', () => {
  assertEquals(one(sample1), '4,6,3,5,6,3,5,2,1,0')
})

Deno.test('two', () => {
  assertEquals(two(sample2), 117440)
})
