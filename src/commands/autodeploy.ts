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

    const currentCron = c.terminal.run("crontab -l");

    
    if(currentCron.isError && !currentCron.err.includes("no crontab for")) {

        c.logError("Unable to add crontab task, Error: " + currentCron.err);
        return;
    }

    const dir = dirname(c.configFilePath);
    let cronContent = currentCron.msg || "";
    fs.writeFileSync(path.join(dir, "cron-backup.txt"), cronContent);
    cronContent = cronContent.split("\n").filter(x => !x.includes("gitco deploy")).join("\n");

    if(!c.optionValues.disable) {
        // Add new cron job if not trying to disable
        cronContent = cronContent + "* * * * * gitco deploy " + c.configFilePath + " > /var/log/gitco.log 2>&1\n"
    }

    
    const cronFile = path.join(dir, "cron-current.txt");
    fs.writeFileSync(cronFile, cronContent);
    
    const cron = c.terminal.run('crontab ' + cronFile);
    
    if(cron.isError) {
        c.logError("Failed to enable automatic deployment with Error"  + cron.err);
        return
    }

    const cronRefresh = c.terminal.run('service cron reload');
    if(cronRefresh.isError) {
        c.logError("Failed to reload cron service with Error"  + cronRefresh.err);
        return;
    }
    
        
    if(c.optionValues.disable) {
        c.logInfo("Automatic deployments are now disabled.");
    } else {
        c.logInfo("Automatic deployments are now enabled. Change detection will run every minute.");
    }
}

const startCronOnWindows2 = (c: Context) => {
    const stop = c.terminal.run("schtasks /delete /tn gitco /f");

    console.log("stop: ", c.optionValues.disable)
    if(c.optionValues.disable) {
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