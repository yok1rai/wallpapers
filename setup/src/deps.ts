import { statusText, formattedText, doesExist, exists } from "./utils.js";
import { name, version, developers, OSes } from "./info.js";
import { platform } from "node:os";
import { ProgramError } from "./errors.js";
import { readFile } from "node:fs/promises";

async function checkExist(apps: string[]): Promise<Record<string, boolean>> {
    const record: Record<string, boolean> = {};

    for (const app of apps) {
        record[app] = await doesExist(app);
    }

    return record;
}

function checkOS(validOSes: string[]): Record<string, boolean> {
    const record: Record<string, boolean> = {};

    record[platform()] = validOSes.includes(platform());

    return record;
}

async function checkInit(
    validInit: string[],
): Promise<Record<string, boolean>> {
    if (!Object.values(checkOS(OSes)).some(Boolean)) {
        throw new ProgramError("Unsupported OS", true);
    }

    let init = "unknown";

    if (await exists("/run/systemd/system")) {
        init = "systemd";
    } else if (await exists("/run/openrc/softlevel")) {
        init = "openrc";
    } else {
        try {
            const pid1 = (await readFile("/proc/1/comm", "utf8")).trim();

            const aliases: Record<string, string> = {
                "openrc-init": "openrc",
                "s6-svscan": "s6",
            };

            init = aliases[pid1] ?? pid1;
        } catch {
            init = "unknown";
        }
    }

    return {
        [init]: validInit.includes(init),
    };
}

export async function statusPanel(deps: string[]) {
    console.log(`${name} v${version}. Developed by ${developers.join(", ")}\n`);

    const depsStat: string[] = [];
    const depsRecord = await checkExist(deps);

    for (const [key, value] of Object.entries(depsRecord)) {
        depsStat.push(
            statusText(
                value,
                `${key} ${value ? "already installed" : "is not installed"}`,
            ),
        );
    }

    formattedText("Dependencies Installed", depsStat);

    if (Object.values(depsRecord).some((value) => !value))
        console.log(statusText(false, "Some dependencies are missing\n"));
    else console.log(statusText(true, "All dependencies are installed\n"));

    const osStat: string[] = [];
    const osRecord = checkOS(OSes);

    for (const [key, value] of Object.entries(osRecord)) {
        osStat.push(
            statusText(
                value,
                `${key} is ${value ? "supported" : "not supported"}`,
            ),
        );
    }

    const initRecord = await checkInit([
        "systemd",
        "openrc",
        "runit",
        "s6",
        "dinit",
    ]);

    for (const [key, value] of Object.entries(initRecord)) {
        osStat.push(
            statusText(
                value,
                `${key} is ${value ? "supported" : "not supported"}`,
            ),
        );
    }

    const sysRecords = { ...osRecord, ...initRecord };

    formattedText(
        "System Status",
        Object.entries(sysRecords).map(([key, value]) =>
            statusText(
                value,
                `${key} is ${value ? "supported" : "not supported"}`,
            ),
        ),
    );

    if (Object.values(sysRecords).some((val) => !val))
        console.log(statusText(false, "OS or init system is not supported\n"));
    else console.log(statusText(true, "Everything is fine!\n"));
}
