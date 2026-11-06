import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { ProgramError } from "./errors.ts"

export function statusText(succeed: boolean, text: string, extra?: string, bold = false): string {
    const color = succeed ? "\x1b[32m" : "\x1b[31m";
    const extratext = extra !== undefined ? ` [${extra}]` : "";
    return `${bold ? "\x1b[1m" : ""}${color}${text}${extratext}\x1b[0m`; 
}

export function formattedText(header: string, bodies: string[]) {
    console.log(`\x1b[1m${header}:\x1b[0m`);
    for (const body of bodies) {
        console.log(body.padStart(body.length + 4, " ")); 
    }
}

export async function exists(path: string): Promise<boolean> {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

export async function doesExist(program: string): Promise<boolean> {
    return new Promise((res, rej) => {
        const child = spawn("pgrep", ["-x", program], {
            stdio: "ignore",
        }); 

        child.on("error", rej); 

        child.on("close", code => {
            if (code === 0) res(true); 
            else if (code === 1) res(false); 
            else rej(new ProgramError(`Pgrep failed: ${code}`)); 
        })
    })
}
