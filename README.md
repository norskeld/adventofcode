# adventofcode

Advent of Code solutions in TypeScript (Deno).

## Prerequisites

- [Deno](https://deno.land)
- [just](https://github.com/casey/just) (optional)

## Installation

Clone the repo and install dependencies:

```bash
deno install
```

## Usage

If you have `just` installed, run `just` to see a list of available recipes.

### Tests

To test solutions against the example inputs:

```bash
deno test --allow-read
```

Or you can filter tests by year + day:

```bash
deno test -R --filter 2025/5
```

> [!NOTE]
> You can run tests using `just`:
>
> ```bash
> just test
> just test --filter 2025/5
> ```

### Run solutions

To run solutions and get their output, you need to provide actual input, which
should be located right next to the solution's `main.ts` file, .e.g. for
`2015/1/main.ts` you should have `2015/1/input.txt` in the same directory:

```bash
# Run all solutions for 2025.
deno --allow-read --allow-run main.ts run 2025

# Run all solutions for 2025 day 5.
deno --allow-read --allow-run main.ts run 2025 5
```

> [!NOTE]
> You can run solutions using `just`:
>
> ```bash
> just run 2025
> just run 2025 5
> ```

### Scaffolding

To scaffold files for a new day run this:

```bash
deno --allow-read --allow-write main.ts scaffold 2025 12
```

This will create the following structure:

```
2025/
└── 12/
    ├── main.ts
    ├── main.test.ts
    ├── input.txt
    └── sample.txt
```

Where `input.txt` is ignored and is not committed to the repo.

> [!NOTE]
> You can scaffold files using `just`:
>
> ```bash
> just scaffold 2024 3
> ```

## License

Do whatever you want.
