import path from "path";
import { Context } from "../context";
import * as fs from 'fs';

export const deploy = (c: Context) => {
    c.config.apps.forEach(async (app) => {
        console.log("Deploying app: " + app.githubRepo);

        var dir = path.join(process.cwd(), app.githubRepo, app.directory);
        await fs.mkdirSync(dir, { recursive: true });

        var clone = await c.terminal.run("git", ["clone", app.githubRepoSsh!]);
        var checkout = await c.terminal.run("git", ["checkout", app.branch], dir);
        console.log("Deploying app: " + checkout);
        const ymls = app.composeFiles.map((yml) => "-f " + yml);
        const args = ["compose", "up", "-d"];
        var dockerCompose = await c.terminal.run("docker", args, dir);
    })
}