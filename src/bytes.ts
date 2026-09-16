// Parsing and formatting for byte sizes, both decimal (KB = 1000) and
// binary (KiB = 1024) units.

const DECIMAL_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const
const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] as const

const UNIT_MULTIPLIERS: Record<string, number> = {
  b: 1,
  kb: 1000,
  mb: 1000 ** 2,
  gb: 1000 ** 3,
  tb: 1000 ** 4,
  pb: 1000 ** 5,
  kib: 1024,
  mib: 1024 ** 2,
  gib: 1024 ** 3,
  tib: 1024 ** 4,
  pib: 1024 ** 5,
}

export interface FormatBytesOptions {
  // Use 1024-based units (KiB, MiB, ...) instead of 1000-based ones.
  binary?: boolean
  // Digits after the decimal point once a unit above bytes is chosen.
  precision?: number
}

// Parses strings like "5MB", "2.5 GiB", or a bare number of bytes.
// Case insensitive; a missing unit means bytes.
export function parseBytes(input: string): number {
  const match = input.trim().match(/^([\d.]+)\s*([a-zA-Z]*)$/)
  if (!match) throw new Error(`cannot parse "${input}" as a byte size`)
  const [, numStr, unitStr] = match
  const value = Number(numStr)
  if (!Number.isFinite(value)) throw new Error(`cannot parse "${input}" as a byte size`)
  const unit = unitStr.toLowerCase() || 'b'
  const multiplier = UNIT_MULTIPLIERS[unit]
  if (multiplier === undefined) throw new Error(`unknown byte unit "${unitStr}"`)
  return Math.round(value * multiplier)
}

// Formats a byte count as a human-readable size, e.g. 1500000 -> "1.50 MB".
export function formatBytes(bytes: number, opts: FormatBytesOptions = {}): string {
  const { binary = false, precision = 2 } = opts
  if (!Number.isFinite(bytes)) throw new Error('formatBytes requires a finite number')
  const sign = bytes < 0 ? '-' : ''
  let n = Math.abs(bytes)
  const units = binary ? BINARY_UNITS : DECIMAL_UNITS
  const base = binary ? 1024 : 1000
  let i = 0
  while (n >= base && i < units.length - 1) {
    n /= base
    i++
  }
  const value = i === 0 ? String(n) : n.toFixed(precision)
  return `${sign}${value} ${units[i]}`
}
