import path from "path";
import { Context } from "../models/context";
import { deploy } from "./deploy";
import * as fs from "fs";

export const autoDeploy = async (c: Context) => {
    c.logInfo("Enabling auto deploy")
    const absConfigPath = path.join(process.cwd(), c.configFilePath);
    const dir = path.dirname(absConfigPath);
    
    const scriptFile = path.join(dir, "gitco-autodeploy.ps1");
    fs.writeFileSync(scriptFile, `gitco deploy ${c.configFilePath}`);


    const cmd = `schtasks /create /sc MINUTE /mo 1 /tn gitco /tr ${scriptFile} /f`
    console.log("CMD", cmd)
    const cron = c.terminal.run(cmd);
    if(cron.err) {
        c.logError("Error creating cron job: " + cron.err);
    }
    if(cron.msg) {
        c.logInfo("Cron job created: " + cron.msg);
    }
}