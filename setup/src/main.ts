import { parseArgs } from "node:util";
import { statusPanel } from "./deps.ts";
import { statusText, formattedText } from "./utils.ts";
import { ProgramError } from "./errors.ts";
import { deps } from "./info.ts";
import { buildNInstall, type BuildTarget } from "./build.ts";

async function main() {
    try {
        if (process.getuid?.() === 0)
            throw new ProgramError("You cannot run this with root priviliges", true); 
        const { values, positionals } = parseArgs({
            args: process.argv.slice(2),
            options: {
                target: {
                    type: "string",
                    default: "cli"
                }
            },
            strict: true,
            allowPositionals: true,
        });

        const [command, ...args] = positionals;

        switch (command) {
            case "status":
            case undefined: {
                await statusPanel(deps);
                break;
            }
            case "help": {
                formattedText("Commands", [
                    "status: Check installation and general status of dependencies",
                    "build: Install the program into the system [Target: manager, hyprpapercli, hyprpapertui, hyprpapergui, all]",
                    "uninstall: Uninstall the application",
                ]);
                formattedText("Options", ["No options yet"]);
                break;
            }
            case "build": {
                const validTargets: BuildTarget[] = [
                    "manager",
                    "cli",
                    "tui",
                    "gui",
                    "all",
                ];
                const target = values.target ?? "cli"; 

                if (!validTargets.includes(target as BuildTarget))
                    throw new ProgramError(`Invalid target: ${target}`, true);

                await buildNInstall(target as BuildTarget); 
                break; 
            }
            case "uninstall": {
                throw new ProgramError("Will be implemented");
            }
            default: {
                throw new ProgramError("Unknown command", true);
            }
        }
    } catch (e) {
        process.exitCode = 1; 
        if (e instanceof ProgramError)
            console.error(statusText(false, e.message));
        else if (e instanceof Error)
            console.error(statusText(false, `Unexpected error: ${e.message}`));
    }
}

main().then((_) => _);
