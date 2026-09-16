#!/usr/bin/env node
import { parseBytes, formatBytes } from './bytes.js'
import { parseDuration, formatDuration } from './duration.js'

function usage(): string {
  return `usage:
  bs bytes parse <text>              parse a byte size, e.g. "5MB" or "2GiB"
  bs bytes format <n> [--binary]     format a byte count as a human size
  bs duration parse <text>           parse a duration, e.g. "1h30m" or "500ms"
  bs duration format <n>             format a millisecond count as a human duration`
}

function main(argv: string[]): number {
  const [domain, action, ...rest] = argv
  try {
    if (domain === 'bytes' && action === 'parse' && rest.length > 0) {
      console.log(parseBytes(rest.join(' ')))
      return 0
    }
    if (domain === 'bytes' && action === 'format' && rest.length > 0) {
      const binary = rest.includes('--binary')
      const arg = rest.find((a) => !a.startsWith('--'))
      console.log(formatBytes(Number(arg), { binary }))
      return 0
    }
    if (domain === 'duration' && action === 'parse' && rest.length > 0) {
      console.log(parseDuration(rest.join(' ')))
      return 0
    }
    if (domain === 'duration' && action === 'format' && rest.length > 0) {
      console.log(formatDuration(Number(rest[0])))
      return 0
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    return 1
  }
  console.error(usage())
  return 1
}

process.exit(main(process.argv.slice(2)))
