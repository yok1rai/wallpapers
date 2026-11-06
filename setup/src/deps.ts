import { statusText, formattedText, doesExist } from "./utils.js"
import { name, version, developers } from "./info.js"

async function checkExist(apps: string[]): Promise<Record<string, boolean>> {
    const record: Record<string, boolean> = {};

    for (const app of apps) {
        record[app] = await doesExist(app);
    }

    return record;
}

async function checkRuns(apps: string[]): Promise<Record<string, boolean>> {
    const record: Record<string, boolean> = {}; 

    return record; 
}

export async function statusPanel(deps: string[]) {
    console.log(`${name} v${version}. Developed by ${developers.join(", ")}\n`); 
    let depsStat = []; 
    const depsRecord = await checkExist(deps); 
    for (const [key, value] of Object.entries(depsRecord)) {
        depsStat.push(value ? statusText(true, `${key} already installed`) : statusText(false, `${key} is not installed`)) 
    }
    formattedText("Dependencies Installed", depsStat); 

    if (Object.values(depsRecord).some(value => !value))
        console.log(statusText(false, "Some dependencies are missing")); 
    else 
        console.log("dependencies are already installed");
}

