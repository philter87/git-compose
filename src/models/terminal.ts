import { spawnSync } from "child_process";
import * as fs from "fs";

export interface TerminalResponse {
    msg: string;
    err: string;
}

export interface ITerminal {
    run(command: string, cwd?: string): TerminalResponse;
    logInfo(...msg: string[]) : void;
    logError(...msg: string[]) : void;
}


export class Terminal implements ITerminal {
    run(command: string, cwd: string = "") : TerminalResponse {
        cwd = cwd || process.cwd();
        const response = spawnSync(command, {encoding: "utf-8", cwd: cwd, shell: true});
        return {
            msg: response.stdout,
            err: response.stderr
        };
    }
    logInfo(...msg: string[]) : void {
        msg.forEach((m) => console.log(m));
    }

    logError(...msg: string[]) : void {
        msg.forEach((m) => console.error(m));
    }
}

export class TerminalMock implements ITerminal {
    public logs: string[] = [];
    public lastError: string = "";
    public errors: string[] = [];
    public commands: string[] = [];

    constructor(private cmdPattern: string = "", private response: TerminalResponse = {"msg": "", err: "Error"}) {}

    run(command: string, cwd = "") : TerminalResponse{
        this.commands.push(command);
        if (this.cmdPattern == command) {
            return this.response;
        }

        return {
            msg: "Ok",
            err: ""
        };
    }

    logInfo(...msg: string[]) : void{
        this.logs.push(...msg);
    }

    logError(...msg: string[]) : void{
        this.errors.push(...msg);
        this.lastError = msg.at(-1) || "";
    }
}