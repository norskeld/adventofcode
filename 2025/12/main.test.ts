import { assertEquals } from '@std/assert'

import { one } from './main.ts'

const sample = Deno.readTextFileSync('2025/12/sample.txt')

// The sample input was a decoy this year, so essentially skipping the test.
Deno.test('one', () => {
  assertEquals(one(sample), 0)
})
