import path, { dirname } from "path";
import { Context } from "../models/context";
import { deploy } from "./deploy";
import * as fs from "fs";

export const autoDeploy = async (c: Context) => {
    c.logInfo("Auto deploy")
    
    if(process.platform == "win32") {
        startCronOnWindows2(c);
        return;
    }

    const cronTask = "* * * * * gitco deploy " + c.configFilePath + " > /var/log/gitco.log 2>&1";
    c.logInfo("Adding cron job: " + cronTask);
    const cron = c.terminal.run('crontab -l | { cat; echo "' + cronTask +'"; } | crontab -');
    
    if(cron.isError) {
        c.logError("Error reading cron jobs: " + cron.err);
        cron.msg = "";
        return;
    }
    c.logInfo("Cron job added: " + cronTask);
}

const startCronOnWindows2 = (c: Context) => {
    const stop = c.terminal.run("schtasks /delete /tn gitco /f");

    console.log("stop: ", c.optionValues.stop)
    if(c.optionValues.stop) {
        if(stop.isError) {
            c.logInfo("Unable to disable automatic deployments. Maybe it is already disabled. Error: " + stop.err);
        }
        c.logInfo("Automatic deployments are now disabled.");
        return;
    }

    if(stop.msg) {
        c.logInfo("\tReplacing existing deployment task");
    }
    var scriptFilePath = path.join(dirname(c.configFilePath), "gitco-deploy-script.ps1");
    fs.writeFileSync(scriptFilePath, `gitco deploy ${c.configFilePath}`);

    var commandResult = c.terminal.run("powershell " + scriptFilePath);
    if(commandResult.isError) {
        c.logError("Error running command: " + commandResult.err, commandResult.msg);
        return;
    }
    c.logInfo(commandResult.msg)



    const cmd = `schtasks /create /sc MINUTE /mo 1 /tn gitco /tr "powershell.exe -File ${scriptFilePath}" /f`
    console.log("cmd: ", cmd)
    const cron = c.terminal.run(cmd);
    if(cron.isError) {
        c.logError("Failed to enable automatic deployment with Error"  + cron.err);
        return;
    }
    c.logInfo("Automatic deployments are now enabled. Change detection will run every minute.");
}