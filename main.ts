import { parseArgs } from '@std/cli/parse-args'

import { scaffold } from './commands/scaffold.ts'
import { runAll } from './commands/run.ts'

const HELP = `
Usage: deno run main.ts <command> [options]

Commands:
  run <year> [day]      Run solutions for a year (optionally filter by day)
  scaffold <year> <day> Scaffold files for a new day

Options:
  -h, --help            Show this help message
`

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ['help'],
    alias: { help: 'h' },
    stopEarly: true,
  })

  const [command, ...rest] = args._

  if (args.help || !command) {
    console.log(HELP.trim())
    return
  }

  switch (command) {
    case 'run': {
      const [year, day] = rest.map(String)

      if (!year) {
        console.error('Error: year is required')
        Deno.exit(1)
      }

      return await runAll([year, day])
    }

    case 'scaffold': {
      const [year, day] = rest.map(String)

      if (!year || !day) {
        console.error('Error: year and day are required')
        Deno.exit(1)
      }

      return await scaffold([year, day])
    }

    default:
      console.error(`Unknown command: ${command}`)
      Deno.exit(1)
  }
}

main()
