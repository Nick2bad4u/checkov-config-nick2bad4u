# checkov-config-nick2bad4u

[![CI](https://github.com/Nick2bad4u/checkov-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/checkov-config-nick2bad4u/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/checkov-config-nick2bad4u.svg)](https://www.npmjs.com/package/checkov-config-nick2bad4u)

Portable shared [Checkov](https://www.checkov.io/) policies for infrastructure as code, repository configuration, GitHub Actions, and secrets. The npm package contains policy files and typed path helpers; install the Python Checkov CLI separately.

## Install

```sh
npm install --save-dev checkov-config-nick2bad4u
python -m pip install checkov
```

```sh
checkov --config-file node_modules/checkov-config-nick2bad4u/.checkov.yml -d .
```

## Presets

| Preset           | Policy                                                                |
| ---------------- | --------------------------------------------------------------------- |
| `default`        | Auto-detect frameworks; low/medium soft, high/critical hard           |
| `strict`         | Every failed check blocks                                             |
| `github-actions` | GitHub Actions, repository configuration, and secrets only            |
| `infrastructure` | Broad auto-detected IaC policy                                        |
| `ci`             | Console plus SARIF; high/critical hard                                |
| `report-only`    | Report policy findings without blocking; scanner errors still surface |

```sh
checkov \
  --config-file node_modules/checkov-config-nick2bad4u/configs/github-actions.yml \
  -d .
```

The shared files intentionally contain no `skip-check` or `skip-path`. Suppressions are security decisions and belong in the consumer repository with an exact check ID and justification.

## Typed path API

```ts
import {
 checkovConfigPaths,
 checkovPresets,
 getCheckovConfigPath,
 loadCheckovConfig,
} from "checkov-config-nick2bad4u";

const ciPath = getCheckovConfigPath("ci");
const ciYaml = await loadCheckovConfig("ci");
```

The resolver returns an absolute package-owned path and rejects unknown runtime values.

## CI example

```yaml
- name: Scan infrastructure policy
  run: >-
   checkov
   --config-file node_modules/checkov-config-nick2bad4u/configs/ci.yml
   -d .
```

The CI preset writes `checkov-results.sarif` in the consumer working directory.

## Development

```sh
npm install
npm run release:verify
```

Tests parse every policy, enforce the no-suppression contract, exercise runtime path errors, verify packed files, and use `checkov --show-config` when the CLI is installed.
