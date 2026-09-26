#!/usr/bin/env node
import { parseBytes, formatBytes } from './bytes.js'
import { parseDuration, formatDuration } from './duration.js'

function usage(): string {
  return `usage:
  bs bytes parse <text> [--json]              parse a byte size, e.g. "5MB" or "2GiB"
  bs bytes format <n> [--binary] [--json]     format a byte count as a human size
  bs duration parse <text> [--json]           parse a duration, e.g. "1h30m" or "500ms"
  bs duration format <n> [--json]             format a millisecond count as a human duration

  --json  print the result as a JSON object instead of plain text`
}

// Splits out recognized flags so the remaining args are just the value/text
// the command operates on, regardless of where the flags were placed.
function splitFlags(rest: string[]): { args: string[]; json: boolean; binary: boolean } {
  const json = rest.includes('--json')
  const binary = rest.includes('--binary')
  const args = rest.filter((a) => a !== '--json' && a !== '--binary')
  return { args, json, binary }
}

function print(value: unknown, json: boolean, jsonKey: string): void {
  console.log(json ? JSON.stringify({ [jsonKey]: value }) : String(value))
}

function main(argv: string[]): number {
  const [domain, action, ...rest] = argv
  try {
    if (domain === 'bytes' && action === 'parse' && rest.length > 0) {
      const { args, json } = splitFlags(rest)
      print(parseBytes(args.join(' ')), json, 'bytes')
      return 0
    }
    if (domain === 'bytes' && action === 'format' && rest.length > 0) {
      const { args, json, binary } = splitFlags(rest)
      print(formatBytes(Number(args[0]), { binary }), json, 'formatted')
      return 0
    }
    if (domain === 'duration' && action === 'parse' && rest.length > 0) {
      const { args, json } = splitFlags(rest)
      print(parseDuration(args.join(' ')), json, 'ms')
      return 0
    }
    if (domain === 'duration' && action === 'format' && rest.length > 0) {
      const { args, json } = splitFlags(rest)
      print(formatDuration(Number(args[0])), json, 'formatted')
      return 0
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (rest.includes('--json')) {
      console.error(JSON.stringify({ error: message }))
    } else {
      console.error(message)
    }
    return 1
  }
  console.error(usage())
  return 1
}

process.exit(main(process.argv.slice(2)))
