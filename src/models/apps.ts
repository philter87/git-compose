import { Context } from "./context";


export interface AppsConfig {
    apps: App[];
}
export interface App {
    appName?: string;
    githubRepo: string;
    githubRepoSsh?: string;
    directory: string;
    branch: string;
    composeFiles: string[];
}

