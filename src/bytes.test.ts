import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseBytes, formatBytes } from './bytes.js'

test('parseBytes: decimal units', () => {
  assert.equal(parseBytes('5MB'), 5_000_000)
  assert.equal(parseBytes('1.5kb'), 1500)
  assert.equal(parseBytes('2GB'), 2_000_000_000)
})

test('parseBytes: binary units', () => {
  assert.equal(parseBytes('2GiB'), 2 ** 31)
  assert.equal(parseBytes('1KiB'), 1024)
})

test('parseBytes: bare numbers are bytes', () => {
  assert.equal(parseBytes('1024'), 1024)
  assert.equal(parseBytes('0'), 0)
})

test('parseBytes: case insensitive and tolerant of whitespace', () => {
  assert.equal(parseBytes('5mb'), 5_000_000)
  assert.equal(parseBytes(' 3 MB '), 3_000_000)
})

test('parseBytes: leading-dot fractional values', () => {
  assert.equal(parseBytes('.5MB'), 500_000)
})

test('parseBytes: rejects empty, garbage, and unknown units', () => {
  assert.throws(() => parseBytes(''))
  assert.throws(() => parseBytes('abc'))
  assert.throws(() => parseBytes('5XB'))
})

test('parseBytes: negative values are not supported yet', () => {
  // documents a known gap: formatBytes can produce "-5 MB" but parseBytes
  // can't read it back. Tracked as a follow-up.
  assert.throws(() => parseBytes('-5MB'))
})

test('formatBytes: sub-unit values have no decimals', () => {
  assert.equal(formatBytes(0), '0 B')
  assert.equal(formatBytes(999), '999 B')
})

test('formatBytes: picks the largest unit that keeps the value >= 1', () => {
  assert.equal(formatBytes(1500), '1.50 KB')
  assert.equal(formatBytes(1536, { binary: true }), '1.50 KiB')
})

test('formatBytes: negative values keep the sign out front', () => {
  assert.equal(formatBytes(-1536), '-1.54 KB')
})

test('formatBytes: precision option controls decimal places', () => {
  assert.equal(formatBytes(1536, { precision: 0 }), '2 KB')
  assert.equal(formatBytes(1536, { precision: 3 }), '1.536 KB')
})

test('formatBytes: rejects non-finite input', () => {
  assert.throws(() => formatBytes(NaN))
  assert.throws(() => formatBytes(Infinity))
})
