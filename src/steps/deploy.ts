import path from "path";
import { Context } from "../context";
import * as fs from 'fs';

export const deploy = (c: Context) => {
    c.config.apps.forEach((app) => {
        console.log("Deploying app: " + app.githubRepo);

        var dir = path.join(process.cwd(), "apps", app.githubRepo, app.directory);
        fs.mkdirSync(dir, { recursive: true });

        var clone = c.terminal.run("git", ["clone", app.githubRepoSsh!]);
        var checkout = c.terminal.run("git", ["checkout", app.branch], dir);
        console.log("Deploying app: " + checkout);
        const ymls = app.composeFiles.map((yml) => "-f " + yml);
        const args = ["compose", "up", "-d"];
        var dockerCompose = c.terminal.run("docker", args, dir);
    })
}