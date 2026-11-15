const enum Instruction {
  Adv,
  Bxl,
  Bst,
  Jnz,
  Bxc,
  Out,
  Bdv,
  Cdv,
}

interface Registers {
  a: number
  b: number
  c: number
}

interface Machine {
  registers: Registers
  instructions: Instruction[]
  ip: number
}

function parseRegisters(s: string): Registers {
  const [a, b, c] = s
    .trim()
    .split('\n')
    .map((line) => {
      const [, reg] = line
        .split(':')
        .map((s) => s.trim())

      return Number(reg)
    })

  return { a, b, c }
}

function parseInstructions(s: string): Instruction[] {
  const [, opcodes] = s
    .trim()
    .split(':')
    .map((s) => s.trim())

  return opcodes
    .split(',')
    .map(Number)
}

function parseMachine(input: string): Machine {
  const [registersRaw, programRaw] = input.trim().split('\n\n')

  return {
    registers: parseRegisters(registersRaw),
    instructions: parseInstructions(programRaw),
    ip: 0,
  }
}

/**
 * Thank you JS for sponsoring this cringe.
 *
 * TL;DR: ^ apparently coerces to 32-bit, but register values can exceed 2^31,
 * so XOR must be done at full precision.
 */
function xor(a: number, b: number): number {
  return Number(BigInt(a) ^ BigInt(b))
}

function combo({ registers }: Machine, operand: number): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand
    case 4:
      return registers.a
    case 5:
      return registers.b
    case 6:
      return registers.c
    default:
      throw new Error(`Invalid combo operand: ${operand}`)
  }
}

function execute(machine: Machine): number[] {
  const output: number[] = []

  let { registers, instructions, ip } = machine

  while (true) {
    if (ip >= instructions.length) break

    const instruction: Instruction = instructions[ip]
    const operand: number = instructions[ip + 1]

    switch (instruction) {
      case Instruction.Adv: {
        const numerator = registers.a
        const denominator = 2 ** combo(machine, operand)
        registers.a = Math.trunc(numerator / denominator)
        ip += 2
        break
      }

      case Instruction.Bxl: {
        registers.b = xor(registers.b, operand)
        ip += 2
        break
      }

      case Instruction.Bst: {
        registers.b = combo(machine, operand) % 8
        ip += 2
        break
      }

      case Instruction.Jnz: {
        if (registers.a !== 0) ip = operand
        else ip += 2
        break
      }

      case Instruction.Bxc: {
        registers.b = xor(registers.b, registers.c)
        ip += 2
        break
      }

      case Instruction.Out: {
        output.push(combo(machine, operand) % 8)
        ip += 2
        break
      }

      case Instruction.Bdv: {
        const numerator = registers.a
        const denominator = 2 ** combo(machine, operand)
        registers.b = Math.trunc(numerator / denominator)
        ip += 2
        break
      }

      case Instruction.Cdv: {
        const numerator = registers.a
        const denominator = 2 ** combo(machine, operand)
        registers.c = Math.trunc(numerator / denominator)
        ip += 2
        break
      }
    }
  }

  return output
}

function interpret(machine: Machine): string {
  return execute(machine).join(',')
}

export function one(input: string): string {
  return interpret(parseMachine(input))
}

export function two(input: string): number {
  const { registers, instructions } = parseMachine(input)
  const target = instructions

  const run = (a: number): number[] =>
    execute({
      registers: { a, b: registers.b, c: registers.c },
      instructions: instructions,
      ip: 0,
    })

  let best: number | undefined

  const search = (prefix: number, depth: number): void => {
    if (depth === target.length) {
      if (best === undefined || prefix < best) {
        best = prefix
      }

      return
    }

    for (let digit = 0; digit < 8; digit++) {
      const candidate = prefix * 8 + digit
      const output = run(candidate)
      const needed = depth + 1
      const offset = target.length - needed

      if (output.length !== needed) {
        continue
      }

      if (output.every((value, i) => value === target[offset + i])) {
        search(candidate, depth + 1)
      }
    }
  }

  search(0, 0)

  if (best === undefined) {
    throw new Error('No value of register A reproduces the program')
  }

  return best
}

if (import.meta.main) {
  const input = Deno.readTextFileSync('2024/17/input.txt')

  console.log([
    one(input),
    two(input),
  ])
}
