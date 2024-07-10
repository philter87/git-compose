import { AppsConfig } from "./apps";
import { DEFAULT_CONFIG_FILE } from "./constants";
import { Context } from "./context";
import * as fs from "fs";

export interface IConfigReader {
    read(c: Context): AppsConfig
}

export class ConfigReader implements IConfigReader {
    read(c: Context): AppsConfig {
        if (c.configFilePath === DEFAULT_CONFIG_FILE) {
            c.logInfo("Using default file path:", DEFAULT_CONFIG_FILE)
        }
    
        const response = fs.readFileSync(c.configFilePath, 'utf8');
        var appsConfig: AppsConfig = JSON.parse(response) as AppsConfig;
        return parseAppValues(appsConfig);
    }
}

export class ConfigReaderMock implements IConfigReader {

    constructor(public config: AppsConfig) {}

    read(c: Context): AppsConfig {
        return parseAppValues(this.config);
    }
}

export const parseAppValues = (c: AppsConfig): AppsConfig => {
    for (const app of c.apps) {
        const repoParts = app.githubRepo.split("/");
        app.appName = app.appName || repoParts.at(-1);
        app.githubRepo = app.githubRepo;
        app.githubRepoSsh = `git@github.com:${app.githubRepo}.git`;
        app.branch = app.branch || "main";
        app.directory = app.directory || "";
        app.composeFiles = app.composeFiles || ["docker-compose.yml"];
    }
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