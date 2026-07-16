import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

import {
    checkovConfigPath,
    checkovConfigPaths,
    type CheckovPreset,
    checkovPresets,
    getCheckovConfigPath,
    loadCheckovConfig,
} from "../src/checkov-config.js";

describe("checkov shared policy", () => {
    it.each(checkovPresets)("loads the %s preset", async (preset) => {
        expect.assertions(5);

        const configPath = getCheckovConfigPath(preset);
        const source = await loadCheckovConfig(preset);
        const config = parse(source) as Record<string, unknown>;

        await access(configPath);

        expect(path.isAbsolute(configPath)).toBe(true);
        expect(configPath).toBe(checkovConfigPaths[preset]);
        expect(source.endsWith("\n")).toBe(true);
        expect(config["compact"]).toBe(true);
        expect(config).not.toHaveProperty("skip-check");
    });

    it("keeps the default path conventional", () => {
        expect.assertions(2);

        expect(checkovConfigPath).toBe(getCheckovConfigPath("default"));
        expect(path.basename(checkovConfigPath)).toBe(".checkov.yml");
    });

    it("rejects unknown presets at runtime", () => {
        expect.assertions(1);

        expect(() => getCheckovConfigPath("invented" as CheckovPreset)).toThrow(
            RangeError
        );
    });

    it("keeps consumer suppressions and path exclusions out of every preset", async () => {
        expect.hasAssertions();

        for (const preset of checkovPresets) {
            const config = parse(await loadCheckovConfig(preset)) as Record<
                string,
                unknown
            >;

            expect(config).not.toHaveProperty("skip-check");
            expect(config).not.toHaveProperty("skip-path");
        }
    });

    it.runIf(spawnSync("checkov", ["--version"]).status === 0)(
        "loads every preset with the real Checkov CLI",
        () => {
            expect.hasAssertions();

            for (const preset of checkovPresets) {
                const result = spawnSync(
                    "checkov",
                    [
                        "--config-file",
                        getCheckovConfigPath(preset),
                        "--show-config",
                    ],
                    { encoding: "utf8" }
                );

                expect(result.status).toBe(0);
            }
        },
        120_000
    );
});
