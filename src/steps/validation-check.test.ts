import { TerminalMock } from "../terminal";
import { validationCheck } from "./validation-check";

describe("validation-check", () => {
    it("docker not installed", () => {
        const terminalMock = new TerminalMock("docker", ["--version"], {msg: "", err: "docker: command not found"})
        
        const errors = validationCheck(terminalMock) 

        expect(errors.at(-1)).toContain("Docker is not installed")
    })

    it("docker ps - docker not running windows", () => {
        const terminalMock = new TerminalMock("docker", ["ps"], {msg: "", err: "error during connect: This error may indicate that the docker daemon is not running.: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/json: open //./pipe/docker_engine: The system cannot find the file specified"})
        
        const errors = validationCheck(terminalMock) 

        expect(errors.at(-1)).toContain("Docker is not running")
    })

    it("docker ps - docker not running ubuntu", () => {
        const terminalMock = new TerminalMock("docker", ["ps"], {msg: "", err: "Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?"})
        
        const errors = validationCheck(terminalMock) 

        expect(errors.at(-1)).toContain("Docker is not running")
    })

    it("no errors should return empty array", () => {
        const terminalMock = new TerminalMock("X", [], {msg: "", err: ""})
        
        const errors = validationCheck(terminalMock) 

        expect(errors).toEqual([])
    })
});
