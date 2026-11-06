import { parseArgs } from "node:util";
import { statusPanel } from "./deps.ts";
import { statusText, formattedText } from "./utils.ts";
import { ProgramError } from "./errors.ts";
import { deps } from "./info.ts";

async function main() {
    try {
        if (process.getuid?.() === 0)
            throw new ProgramError("You cannot run this with root priviliges", true); 
        const { values, positionals } = parseArgs({
            args: process.argv.slice(2),
            options: {},
            strict: true,
            allowPositionals: true,
        });

        const [command, ...args] = positionals;

        if (command === undefined)
            throw new ProgramError(
                "No command given (run with `help` to see commands)",
                true,
            );

        switch (command) {
            case "status": {
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
                console.log("Will be implemented");
                break;
            }
            case "uninstall": {
                console.log("Will be implemented");
                break;
            }
            default: {
                throw new ProgramError("Unknown command", true);
            }
        }
    } catch (e) {
        if (e instanceof ProgramError)
            console.error(statusText(false, e.message));
        else if (e instanceof Error)
            console.error(statusText(false, `Unexpected error: ${e.message}`));
    }
}

main().then((_) => _);
