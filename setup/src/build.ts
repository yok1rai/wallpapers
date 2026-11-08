import { spawn } from "node:child_process";
import { ProgramError } from "./errors.js"

type Target = "manager" | "cli" | "tui" | "gui";
export type BuildTarget = Target | "all";

function runMake(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn("make", [command], {
            cwd,
            stdio: "inherit",
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new ProgramError(`make ${command} failed: ${code}`));
            }
        });
    });
}

async function buildManager(): Promise<void> {
    await runMake("build", "./manager");
}

async function buildCli(): Promise<void> {
    throw new ProgramError("CLI build not implemented");
}

async function buildTui(): Promise<void> {
    throw new ProgramError("TUI build not implemented");
}

async function buildGui(): Promise<void> {
    throw new ProgramError("GUI build not implemented");
}

async function InstallManager(): Promise<void> {
    await runMake("user-install", "./manager");
}

async function InstallCli(): Promise<void> {
    throw new ProgramError("CLI installation not implemented");
}

async function InstallTui(): Promise<void> {
    throw new ProgramError("TUI installation not implemented");
}

async function InstallGui(): Promise<void> {
    throw new ProgramError("GUI installation not implemented");
}

const tasks = {
    manager: {
        build: buildManager,
        install: InstallManager,
    },
    cli: {
        build: buildCli,
        install: InstallCli,
    },
    tui: {
        build: buildTui,
        install: InstallTui,
    },
    gui: {
        build: buildGui,
        install: InstallGui,
    },
};

export async function buildNInstall(
    target: BuildTarget,
): Promise<void> {
    const targets: Target[] =
        target === "all"
            ? ["manager", "cli", "tui", "gui"]
            : [target];

    for (const name of targets) {
        await tasks[name].build();
        console.log(`${name} successfully built`);
    }

    for (const name of targets) {
        await tasks[name].install();
        console.log(`${name} successfully installed`);
    }
}

