default:
  @just --list

# Run solutions for a year, optionally filtering by day.
run year day='':
  @deno run --allow-read --allow-run main.ts run {{year}} {{day}}

# Scaffold files for a new day.
scaffold year day:
  @deno run --allow-read --allow-write main.ts scaffold {{year}} {{day}}

# Test all solutions against their example input.
test *args='':
  @deno test --allow-read {{args}}

# Show help.
help:
  @deno run main.ts --help
