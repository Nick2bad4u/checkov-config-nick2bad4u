import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** Supported Checkov policy presets. */
export type CheckovPreset =
    | "ci"
    | "default"
    | "github-actions"
    | "infrastructure"
    | "report-only"
    | "strict";

/** All bundled Checkov policy preset names. */
export const checkovPresets: readonly CheckovPreset[] = Object.freeze([
    "default",
    "strict",
    "github-actions",
    "infrastructure",
    "ci",
    "report-only",
]);

const paths: Readonly<Record<CheckovPreset, string>> = Object.freeze({
    ci: fileURLToPath(new URL("../configs/ci.yml", import.meta.url)),
    default: fileURLToPath(new URL("../.checkov.yml", import.meta.url)),
    "github-actions": fileURLToPath(
        new URL("../configs/github-actions.yml", import.meta.url)
    ),
    infrastructure: fileURLToPath(
        new URL("../configs/infrastructure.yml", import.meta.url)
    ),
    "report-only": fileURLToPath(
        new URL("../configs/report-only.yml", import.meta.url)
    ),
    strict: fileURLToPath(new URL("../configs/strict.yml", import.meta.url)),
});

/** Absolute path to the default `.checkov.yml`. */
export const checkovConfigPath: string = paths.default;

/** Immutable mapping from preset names to package-owned absolute paths. */
export const checkovConfigPaths: Readonly<Record<CheckovPreset, string>> =
    paths;

/**
 * Resolve one bundled Checkov config to an absolute filesystem path.
 *
 * @throws RangeError if `preset` is not a bundled preset name.
 */
export function getCheckovConfigPath(
    preset: CheckovPreset = "default"
): string {
    switch (preset) {
        case "ci":
        case "default":
        case "github-actions":
        case "infrastructure":
        case "report-only":
        case "strict": {
            return paths[preset];
        }
        default: {
            throw new RangeError(
                "Unknown Checkov preset. Expected one of: default, strict, github-actions, infrastructure, ci, report-only."
            );
        }
    }
}

/** Load one bundled Checkov config as YAML text. */
export async function loadCheckovConfig(
    preset: CheckovPreset = "default"
): Promise<string> {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- The resolver returns only package-owned preset paths.
    return readFile(getCheckovConfigPath(preset), "utf8");
}

export default checkovConfigPath;
