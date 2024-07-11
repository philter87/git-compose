import path from "path";
import { Context } from "../models/context";
import { deploy } from "./deploy";
import * as fs from "fs";

export const autoDeploy = async (c: Context) => {
    c.logInfo("Auto deploy")
    const absConfigPath = path.join(process.cwd(), c.configFilePath);
    const dir = path.dirname(absConfigPath);

    
    if(process.platform == "win32") {
        startCronOnWindows(c, absConfigPath);
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

const startCronOnWindows = (c: Context, absConfigPath: string) => {
    // const scriptFile = path.join(dir, "gitco-autodeploy.ps1");
    // fs.writeFileSync(scriptFile, "gitco deploy $PSScriptRoot\\" + c.configFilePath);

    const cronDelete = c.terminal.run("schtasks /delete /tn gitco /f");
    if(cronDelete.msg) {
        c.logInfo("\tReplacing existing deployment task");
    }
    if(cronDelete.isError){
        c.logError("\tError deleting cron job: " + cronDelete.err);
    }

    const scheduledCommand = `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "gitco deploy ${absConfigPath}"`
    console.log("Scheduled Command", scheduledCommand)
    var commandResult = c.terminal.run(scheduledCommand)
    console.log("Scheduled Error", commandResult.err)
    console.log("Scheduled Message", commandResult.msg)

    return;
    // const cmd = `schtasks /create /sc MINUTE /mo 1 /tn gitco /tr "powershell.exe -NoProfile -ExecutionPolicy Bypass -File ${scriptFile}" /f`
    const cmd = `schtasks /create /sc MINUTE /mo 1 /tn gitco /tr "${scheduledCommand}" /f`
    console.log("CMD", cmd)


    const cron = c.terminal.run(cmd);
    if(cron.err) {
        c.logError("\tError creating cron job " + cmd + ". Error: "  + cron.err);
    }
    if(cron.msg) {
        c.logInfo("\tAutomatic deployments are now enabled. Change detection will run every minute.");
    }
}