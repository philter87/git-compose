import { Context } from "../models/context";
import { Terminal, TerminalMock } from "../models/terminal";
import { AppsConfig} from "../models/apps";
import { deploy } from "./deploy"
import { ConfigReaderMock } from "../models/config-reader";


const appConfig : AppsConfig = {
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

const appsConfig1 : AppsConfig = {
    apps: [
        {
            githubRepo: "test",
            composeFiles: ["docker-compose.yml"],
            branch: "main",
            directory: ""
        }
    ]
}

describe("deploy step", () => {
    it("real", () => {
        let c = new Context().withConfig(appConfig);
        
        deploy(c);
    })
    it("log: we are using apps.json as default", () => {
        const c = Context.createMock().withConfig(appConfig)
        
        deploy(c);
    })
})