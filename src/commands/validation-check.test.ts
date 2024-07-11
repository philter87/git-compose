import { Terminal, TerminalMock } from "../models/terminal";
import { validationCheck } from "./validation-check";

describe("validation-check", () => {
    it("real", async () => {
        const terminal = new Terminal()
        
        await validationCheck(terminal) 
    })

    it("docker not installed", async () => {
        const terminal = new TerminalMock("docker --version", "docker: command not found")
        
        await validationCheck(terminal) 

        terminal.checkIfErrorIsLogged("[ ] Docker installation")
    })

    it("docker ps - docker not running. (Using windows)", async () => {
        const terminal = new TerminalMock("docker ps", "error during connect: This error may indicate that the docker daemon is not running.: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/json: open //./pipe/docker_engine: The system cannot find the file specified")
        
        await validationCheck(terminal) 

        terminal.checkIfErrorIsLogged("[ ] Docker healthiness");
    })

    it("docker ps - docker not running (Using ubuntu)", async () => {
        const terminal = new TerminalMock("docker ps", "Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?")
        
        await validationCheck(terminal) 

        terminal.checkIfErrorIsLogged("[ ] Docker healthiness");
    })

    it("no errors should return empty array", async () => {
        const terminal = new TerminalMock("X", "This is an error we will never see")
        
        await validationCheck(terminal) 

        expect(terminal.errors).toEqual([])
        expect(terminal.lastError).toEqual("")
    })
});
