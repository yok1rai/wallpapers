import { commandExists } from "./utils.js"
import { packageManagers } from "./info.js"

export function detectPackageManager(): string | null {
    const managers = packageManagers; 

    return managers.find(commandExists) ?? null; 
}


