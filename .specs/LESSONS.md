# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - When an AC requires a tool's own built-in failure behavior (e.g. npm ci integrity check, engine-strict), add a dedicated negative-path test that triggers it rather than relying on the mechanism's reputation as evidence.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `toolchain` · harmful: 0
- features: engineering-baseline
- evidence: BASE-04 (toolchain)
- last seen: 2026-09-13T15:50:13Z

### L-002 - An AC phrased as a conditional (IF X causes failure THEN document Y) with no X ever occurring in the diff should be marked N/A explicitly in spec.md rather than left to the Verifier to flag as unexercised.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec-writing` · harmful: 0
- features: engineering-baseline
- evidence: BASE-08 (spec-writing)
- last seen: 2026-09-13T15:50:13Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
