import { spawnSync } from "child_process";
import { ITerminal, Terminal } from "../models/terminal";


export const validationCheck = async (terminal: ITerminal = new Terminal()): Promise<void> => {
    terminal.logInfo("","Checking system requirements...")

    const osPlatform = process.platform;

    if(osPlatform == "win32") {
        terminal.logInfo("[X] OS support: Windows is supported.");
    } else if (osPlatform == "linux") {
        terminal.logInfo("[X] OS support: Linux is supported.");
    } else {
        terminal.logError("[ ] OS support: Unsupported OS: " + osPlatform);
        terminal.logError("\tPlease use Windows or Linux to run GitCo.");
        return;
    }
    

    const gitVersion = await terminal.run("git --version");
    if (gitVersion.isError) {
        terminal.logError("[ ] Git installation. MISSING!");
    } else {
        terminal.logInfo("[X] Git installation: '" + gitVersion.msg + "'");
    }

    const dockerVersion = await terminal.run("docker --version")
    if (dockerVersion.isError) {
        terminal.logError("[ ] Docker installation: MISSING. Please install Docker and try again.");
        return;
    } else {
        terminal.logInfo("[X] Docker installation: '" + dockerVersion.msg +"'");
    }

    const dockerPs = await terminal.run("docker ps");
    if (dockerPs.err.includes("running")) {
        terminal.logError("[ ] Docker healthiness: NOT RUNNING. Please start the Docker service and try again.");
        terminal.logError("\tError: " + dockerPs.err);
        return;
    } else {
        terminal.logInfo("[X] Docker healthiness: Its alive!");
    }

    if (dockerPs.err.includes("permission denied")) {
        terminal.logError("[ ] Docker permissions: DENIED. Docker might be running as root user. Use 'sudo -s' and run 'gitco validate' again");
        terminal.logError("\t" + dockerPs.err);
        return;
    } else {
        terminal.logInfo("[X] Docker permissions: OK");
    }

    if (dockerPs.isError) {
        terminal.logError("", "Found unknown error:", dockerPs.err)
        return;
    }

    terminal.logInfo("", "Yay! Your system is ready!","")
}