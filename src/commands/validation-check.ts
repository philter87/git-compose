import { spawnSync } from "child_process";
import { ITerminal, Terminal } from "../models/terminal";


export const validationCheck = async (terminal: ITerminal = new Terminal()): Promise<void> => {
    terminal.logInfo("Checking system requirements...")

    const dockerVersion = await terminal.run("docker --version")
    if (dockerVersion.err) {
        terminal.logError("Docker is not installed. Please install Docker and try again")
        return;
    }

    const dockerPs = await terminal.run("docker ps");
    if (dockerPs.err.includes("running")) {
        terminal.logError(dockerPs.err, "", "Docker is not running. Please start Docker and try again.")
        return;
    }

    if (dockerPs.err.includes("permission denied")) {
        terminal.logError(dockerPs.err, "", "Docker commands are not allowed. Docker might be running as root user. Use 'sudo -s' and try the command again.");
        return;
    }

    if (dockerPs.err) {
        terminal.logError(dockerPs.err, "", "Unable to run docker commands. Please check your Docker installation and try again.");
        return;
    }

    const gitVersion = await terminal.run("git --version");
    if (gitVersion.err) {
        terminal.logError(gitVersion.err, "", "Git is not installed. Please install Git and try again.");
        return;
    }
}