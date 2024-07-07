import { ITerminal, Terminal } from "../terminal";

export const validationCheck = (terminal: ITerminal = new Terminal()): string[] => {
    const dockerVersion = terminal.run("docker", ["--version"])
    if (dockerVersion.err) {
        return ["Docker is not installed. Please install Docker and try again."];
    }

    const dockerPs = terminal.run("docker", ["ps"]);
    if (dockerPs.err.includes("running")) {
        return [dockerPs.err, "", "Docker is not running. Please start Docker and try again."];
    }

    if (dockerPs.err.includes("permission denied")) {
        return [dockerPs.err, "", "Docker commands are not allowed. Docker might be running as root user. Use 'sudo -s' and try the command again."];
    }

    if (dockerPs.err) {
        return [dockerPs.err, "", "Unable to run docker commands. Please check your Docker installation and try again."];
    }

    const gitVersion = terminal.run("git", ["--version"]);
    if (gitVersion.err) {
        return [gitVersion.err, "", "Git is not installed. Please install Git and try again."];
    }

    return [];
}