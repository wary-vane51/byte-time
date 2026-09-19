import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseDuration, formatDuration } from './duration.js'

test('parseDuration: single units', () => {
  assert.equal(parseDuration('500ms'), 500)
  assert.equal(parseDuration('2d'), 172_800_000)
  assert.equal(parseDuration('1w'), 604_800_000)
})

test('parseDuration: combined units', () => {
  assert.equal(parseDuration('1h30m'), 5_400_000)
  assert.equal(parseDuration('1m30s500ms'), 90_500)
})

test('parseDuration: whitespace between chunks is ignored', () => {
  assert.equal(parseDuration('1h 30m'), 5_400_000)
})

test('parseDuration: fractional amounts', () => {
  assert.equal(parseDuration('1.5h'), 5_400_000)
})

test('parseDuration: rejects empty and unparseable input', () => {
  assert.throws(() => parseDuration(''))
  assert.throws(() => parseDuration('abc'))
  assert.throws(() => parseDuration('5x'))
  assert.throws(() => parseDuration('1h5'))
})

test('formatDuration: zero and simple values', () => {
  assert.equal(formatDuration(0), '0ms')
  assert.equal(formatDuration(500), '500ms')
})

test('formatDuration: drops zero units and combines the rest', () => {
  assert.equal(formatDuration(5_400_000), '1h30m')
  assert.equal(formatDuration(90_500), '1m30s500ms')
})

test('formatDuration: negative values keep the sign out front', () => {
  assert.equal(formatDuration(-5_400_000), '-1h30m')
})

test('formatDuration: rejects non-finite input', () => {
  assert.throws(() => formatDuration(NaN))
  assert.throws(() => formatDuration(Infinity))
})

test('round-trips exactly for non-negative integer millisecond values', () => {
  for (const ms of [0, 1, 999, 1000, 60_000, 90_500, 5_400_000, 604_800_000]) {
    assert.equal(parseDuration(formatDuration(ms)), ms)
  }
})
