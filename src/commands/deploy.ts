import path from "path";
import { Context } from "../models/context";
import * as fs from 'fs';

export const deploy = (c: Context) => {
    c.getAppsConfig().apps.forEach((app) => {
        c.logInfo("")
        c.logInfo("Deploying app: " + app.appName)

        const absoluteConfigPath = path.join(process.cwd(), c.configFilePath);
        const configDir = path.dirname(absoluteConfigPath);

        var appsDir = path.join(configDir, "apps");
        var repoRootDir = path.join(appsDir, app.appName!);
        var composeDir = path.join(repoRootDir, app.directory);

        // Create apps directory if missing
        fs.mkdirSync(appsDir, { recursive: true });

        // Check if the directory is empty
        const isFirstDeployment = !fs.existsSync(repoRootDir);
        if (isFirstDeployment) {
            c.logInfo("\tCloning repo: " + app.githubRepoSsh)
            var clone = c.terminal.run("git clone " + app.githubRepoSsh + " " + app.appName!, appsDir);
            if (clone.isError) {
                c.terminal.logError("Error cloning repo: " + clone.err);
            }
        }

        if (app.branch) {
            c.logInfo("\tChecking out branch: " + app.branch)
            var checkout = c.terminal.run("git checkout " + app.branch, repoRootDir);
            if (checkout.isError) {
                c.terminal.logError("Error checking out branch: " + checkout.err);
            }
        }

        var pull = c.terminal.run("git pull", repoRootDir);
        if (pull.isError) {
            c.logError("Error pulling repo: " + pull.err);
        }
        if (pull.msg.includes("Already up to date") && !isFirstDeployment) {
            c.logInfo("\tNo changes detected. Skipping deployment.")
            return;
        }
        c.logInfo("\Change detected. Deploying " + app.appName + " ...")
        var dockerCompose = c.terminal.run("docker compose up -d", composeDir);
        if (dockerCompose.isError) {
            c.terminal.logError("Error running docker compose: " + dockerCompose.err);
        }
    })
}