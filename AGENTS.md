# Repository Instructions

This repository publishes `checkov-config-nick2bad4u`. Treat `.checkov.yml`, every file under `configs/`, and the typed preset-path API as public package surfaces.

## Priorities

- Never put consumer check suppressions, path exclusions, credentials, or repository identity into shared policy.
- Preserve secrets scanning and explicit failure semantics.
- Remember that Checkov `skip-path` values are regular expressions, not globs.
- Validate configs with `checkov --show-config` when Checkov is available.
- This package supplies configuration only; it must not claim to install Checkov.

## Commands

```sh
npm run build:runtime
npm run typecheck
npm test
npm run release:verify
```
