import path from "path";
import { Context } from "../models/context";
import * as fs from 'fs';

export const deploy = (c: Context) => {
    c.getAppsConfig().apps.forEach((app) => {
        c.logInfo("")
        c.logInfo("Deploying app: " + app.appName)

        var appsDir = path.join(process.cwd(), "apps");
        var repoRootDir = path.join(appsDir, app.appName!);
        var composeDir = path.join(repoRootDir, app.directory);

        // Create apps directory if missing
        fs.mkdirSync(appsDir, { recursive: true });
        
        // Check if the directory is empty
        const isFirstDeployment = !fs.existsSync(repoRootDir);
        if(isFirstDeployment) {
            var clone = c.terminal.run("git clone " + app.githubRepoSsh + " " + app.appName!, appsDir);
            if(clone.err) {
                c.terminal.logError("Error cloning repo: " + clone.err);
            }
        }
        
        var checkout = c.terminal.run("git checkout " + app.branch, repoRootDir);
        if(checkout.err && !checkout.err.includes("Already on")) {
            c.terminal.logError("Error checking out branch: " + checkout.err);
        }

        var pull = c.terminal.run("git pull", repoRootDir);
        if(!pull.msg.includes("Already up to date") || isFirstDeployment) {
            var dockerCompose = c.terminal.run("docker compose up -d", composeDir);
            if(dockerCompose.err) {
                c.terminal.logError("Error running docker compose: " + dockerCompose.err);
            }
        }
    })
}