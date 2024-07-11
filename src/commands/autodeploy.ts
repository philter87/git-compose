import path from "path";
import { Context } from "../models/context";
import { deploy } from "./deploy";
import * as fs from "fs";

export const autoDeploy = async (c: Context) => {
    c.logInfo("Enabling auto deploy")
    const absConfigPath = path.join(process.cwd(), c.configFilePath);
    const dir = path.dirname(absConfigPath);
    
    if(process.platform == "win32") {
        startCronOnWindows(c);
        c.logInfo("Automatic change detection enabled - will run every minute");
        return;
    }

    const cronTask = "* * * * * gitco deploy " + absConfigPath + " > /var/log/gitco.log 2>&1";
    c.logInfo("Adding cron job: " + cronTask);
    const cron = c.terminal.run('crontab -l | { cat; echo "' + cronTask +'"; } | crontab -');
    
    if(cron.isError) {
        c.logError("Error reading cron jobs: " + cron.err);
        cron.msg = "";
        return;
    }
    c.logInfo("Cron job added: " + cronTask);
}

const startCronOnWindows = (c: Context) => {
    const scriptFile = path.join(dir, "gitco-autodeploy.ps1");
    fs.writeFileSync(scriptFile, "gitco deploy $PSScriptRoot\\" + c.configFilePath);


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