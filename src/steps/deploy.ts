import path from "path";
import { Context } from "../context";
import * as fs from 'fs';

export const deploy = (c: Context) => {
    c.config.apps.forEach((app) => {
        console.log("Deploying app: " + app.githubRepo);
        var repoName = app.githubRepo.split("/")[1];

        var appsDir = path.join(process.cwd(), "apps");
        var repoRootDir = path.join(appsDir, repoName);
        var composeDir = path.join(repoRootDir, app.directory);

        // Create apps directory if missing
        fs.mkdirSync(appsDir, { recursive: true });
        
        // Check if the directory is empty
        const isFirstDeployment = !fs.existsSync(repoRootDir);
        if(isFirstDeployment) {
            var clone = c.terminal.run("git clone " + app.githubRepoSsh, appsDir);
            console.log("Cloning app: " + clone);
        }
        
        var checkout = c.terminal.run("git checkout " + app.branch, repoRootDir);
        if(checkout.err) {
            c.terminal.logError("Error checking out branch: " + checkout.err);
        }

        var pull = c.terminal.run("git pull", repoRootDir);
        if(!pull.msg.includes("Already up to date") || isFirstDeployment) {
            var dockerCompose = c.terminal.run("docker compose up -d", composeDir);
            console.log("Docker compose: ", dockerCompose.msg, dockerCompose.err);
        }
    })
}