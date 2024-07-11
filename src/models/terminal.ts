import { spawnSync } from "child_process";
import * as fs from "fs";

export interface TerminalResponse {
    isError: boolean;
    msg: string;
    err: string;
}

export interface ITerminal {
    run(command: string, cwd?: string, errorMsgOnFail?: string): TerminalResponse;
    logInfo(...msg: string[]) : void;
    logError(...msg: string[]) : void;
}


export class Terminal implements ITerminal {
    run(command: string, cwd?: string, errorMsgOnFail?: string) : TerminalResponse {
        cwd = cwd || process.cwd();
        const response = spawnSync(command, {encoding: "utf-8", cwd: cwd, shell: true});
        const isError = response.status != 0;

        if (isError && errorMsgOnFail) {
            this.logError(errorMsgOnFail + ": " + response.stderr);
        }

        return {
            isError,
            msg: response.stdout.trim(),
            err: response.stderr.trim()
        };
    }
    logInfo(...msg: string[]) : void {
        msg.forEach((m) => console.log(m));
    }

    logError(...msg: string[]) : void {
        msg.forEach((m) => console.error(m));
    }
}

const OK = {msg: "Ok", err: "", isError: false};
export class TerminalMock implements ITerminal {
    public logs: string[] = [];
    public lastError: string = "";
    public errors: string[] = [];
    public commands: string[] = [];

    constructor(private cmdPattern: string = "", private mockedError: string  ="") {}

    run(command: string, cwd = "", errorMsgOnFail?: string) : TerminalResponse{
        this.commands.push(command);
        if (this.cmdPattern == command) {
            return {...OK, isError: true, err: this.mockedError};
        }

        return OK;
    }

    logInfo(...msg: string[]) : void{
        this.logs.push(...msg);
    }

    logError(...msg: string[]) : void{
        this.errors.push(...msg);
        this.lastError = msg.at(-1) || "";
    }

    checkIfErrorIsLogged(errorPattern: string){
        const isErrorLogged = this.errors.some(e => e.startsWith(errorPattern));
        if(!isErrorLogged){
            throw new Error("The error '" + errorPattern + "' was not found among the errors: ['" + this.errors.join("','" + "']"));
        }
        return isErrorLogged;
    }
}