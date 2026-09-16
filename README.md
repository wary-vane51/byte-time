# byte-time

Byte sizes and durations show up everywhere as strings — config files say
"512MB" or "30s", log lines say "2.1GiB" or "1h30m" — and every codebase
ends up with its own half-finished regex to deal with them, usually with
edge cases that break on the next unit it meets. This is a small library
that parses and formats both, plus a CLI for using it from the shell.

Two independent modules:

- `bytes` — parse strings like `"5MB"` or `"2GiB"` into a byte count, and
  format a byte count back into a human-readable string, in either decimal
  (1000-based) or binary (1024-based) units.
- `duration` — parse strings like `"1h30m"` or `"500ms"` into milliseconds,
  and format milliseconds back into a compact duration string.

## Install

No published package yet. Clone the repo and build it:

```
npm run build
```

## Library usage

```ts
import { parseBytes, formatBytes } from './dist/bytes.js'
import { parseDuration, formatDuration } from './dist/duration.js'

parseBytes('5MB')             // 5000000
parseBytes('2GiB')            // 2147483648
formatBytes(1536)             // "1.54 KB"
formatBytes(1536, { binary: true })  // "1.50 KiB"

parseDuration('1h30m')        // 5400000
parseDuration('500ms')        // 500
formatDuration(5400000)       // "1h30m"
formatDuration(90500)         // "1m30s500ms"
```

`formatDuration` and `parseDuration` round-trip exactly for integer
millisecond values — `parseDuration(formatDuration(ms)) === ms`.

## CLI usage

```
$ bs bytes parse "2.5GiB"
2684354560

$ bs bytes format 2684354560 --binary
2.50 GiB

$ bs duration parse "1h30m"
5400000

$ bs duration format 5400000
1h30m
```

## What's not here yet

No tests, no published npm package, no locale-aware number formatting.
See the commit history for where this is headed.

## License

MIT, see [LICENSE](./LICENSE).
