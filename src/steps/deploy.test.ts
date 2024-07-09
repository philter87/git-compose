import { Context } from "../context";
import { Terminal, TerminalMock } from "../terminal";
import { deploy } from "./deploy"

describe("deploy step", () => {
    it("real", () => {
        const c = new Context(new Terminal());
        c.config = {
            apps: [
                {
                    githubRepo: "philter87/home-server",
                    githubRepoSsh: `git@github.com:philter87/home-server.git`,
                    composeFiles: ["docker-compose.yml"],
                    branch: "main",
                    directory: "helper-apps/test-app"
                }
            ]
        }
        
        deploy(c);
    })
    it("log: we are using apps.json as default", () => {
        const t = new TerminalMock("docker compose up -d");
        const c = new Context(t, ["node", "gitco", "deploy"]);
        c.config = {
            apps: [
                {
                    githubRepo: "test",
                    composeFiles: ["docker-compose.yml"],
                    branch: "main",
                    directory: "."
                }
            ]
        }
        
        deploy(c);
    })
})