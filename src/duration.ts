// Parsing and formatting for durations, expressed internally as milliseconds.

const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
}

// Largest to smallest so formatDuration greedily picks the coarsest units,
// and so "ms" is tried before "m" during parsing (see parseDuration).
const UNIT_ORDER: [string, number][] = [
  ['w', UNIT_MS.w],
  ['d', UNIT_MS.d],
  ['h', UNIT_MS.h],
  ['m', UNIT_MS.m],
  ['s', UNIT_MS.s],
  ['ms', UNIT_MS.ms],
]

// Parses strings like "1h30m", "2d", or "500ms" into a millisecond count.
// Chunks can be combined and whitespace between them is ignored.
export function parseDuration(input: string): number {
  const compact = input.trim().replace(/\s+/g, '')
  if (compact === '') throw new Error('cannot parse empty string as a duration')
  const re = /([\d.]+)(ms|w|d|h|m|s)/g
  let match: RegExpExecArray | null
  let total = 0
  let matchedLength = 0
  while ((match = re.exec(compact))) {
    total += Number(match[1]) * UNIT_MS[match[2]]
    matchedLength += match[0].length
  }
  if (matchedLength !== compact.length) {
    throw new Error(`cannot parse "${input}" as a duration`)
  }
  return Math.round(total)
}

// Formats a millisecond count as a compact duration, e.g. 5_400_000 -> "1h30m".
// Drops units that are zero; round-trips exactly through parseDuration.
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) throw new Error('formatDuration requires a finite number')
  const sign = ms < 0 ? '-' : ''
  let remaining = Math.round(Math.abs(ms))
  if (remaining === 0) return '0ms'
  const parts: string[] = []
  for (const [label, size] of UNIT_ORDER) {
    if (remaining >= size) {
      const count = Math.floor(remaining / size)
      parts.push(`${count}${label}`)
      remaining -= count * size
    }
  }
  return sign + parts.join('')
}
