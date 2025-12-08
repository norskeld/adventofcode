import { assert } from '@std/assert'

import { scaffold } from './commands/scaffold.ts'
import { runAll } from './commands/run.ts'

async function main() {
  const [command, ...args] = Deno.args

  switch (command) {
    case 'scaffold':
      assert(args.length === 2, 'Expected exactly 2 arguments: year and day')
      return await scaffold(args)

    case 'run':
      assert(args.length === 1, 'Expected exactly 1 argument: year')
      return await runAll(args)

    case undefined:
      return console.log('No commands specfied')

    default:
      return console.log(`Unknown command: ${command}`)
  }
}

main()
