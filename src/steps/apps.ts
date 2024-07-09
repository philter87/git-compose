import { Context } from "../context";
import * as fs from "fs";

export interface AppsConfig {
    apps: App[];
}
export interface App {
    githubRepo: string;
    githubRepoSsh?: string;
    directory: string;
    branch: string;
    composeFiles: string[];
}


export const parseAppsFile = (c: Context, filePath?: string): Context => {
    if (filePath === undefined) {
        c.logInfo("No file path provided. Using default file path: apps.json")
        filePath = "apps.json";
    }

    const response = fs.readFileSync(filePath, 'utf8');
    var appsConfig: AppsConfig = JSON.parse(response) as AppsConfig;

    for (const app of appsConfig.apps) {
        app.githubRepo = app.githubRepo;
        app.githubRepoSsh = `git@github.com:${app.githubRepo}.git`;
        app.branch = app.branch || "main";
        app.directory = app.directory || "";
        app.composeFiles = app.composeFiles || ["docker-compose.yml"];
    }

    c.config = appsConfig;
    return c;
}

const parseGitHubRepo = (githubRepo: string): string => {
    if (githubRepo.startsWith("git@github.com")) {
        return githubRepo;
    }

    if (githubRepo.startsWith("https://")) {
        return githubRepo
    }
    return `git@github.com:${githubRepo}.git`
}