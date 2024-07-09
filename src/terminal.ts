import { spawnSync } from "child_process";
import * as fs from "fs";

export interface TerminalResponse {
    msg: string;
    err: string;
}

export interface ITerminal {
    run(command: string, args: string[], cwd?: string): Promise<TerminalResponse>;
    logInfo(...msg: string[]) : void;
    logError(...msg: string[]) : void;
}


export class Terminal implements ITerminal {
    async run(command: string, args: string[], cwd: string = "") : Promise<TerminalResponse> {
        cwd = cwd || process.cwd();
        fs.mkdirSync(cwd, { recursive: true });
        const response = await spawnSync(command, args, {encoding: "utf-8", cwd: cwd});
        console.log("REAL COMMAND", response.stdout, response.stderr);
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
    public commandsJoined: string[] = [];

    constructor(private commandJoined: string = "", private response: TerminalResponse = {"msg": "", err: "Error"}) {}

    run(command: string, args: string[] = [], cwd = "") : Promise<TerminalResponse>{
        const currentCommandJoined  = `${command} ${args.join(" ")}`;
        this.commands.push(command);
        this.commandsJoined.push(currentCommandJoined);
        if (this.commandJoined == currentCommandJoined) {
            return Promise.resolve(this.response);
        }

        return Promise.resolve({
            msg: "Ok",
            err: ""
        });
    }

    logInfo(...msg: string[]) : void{
        this.logs.push(...msg);
    }

    logError(...msg: string[]) : void{
        this.errors.push(...msg);
        this.lastError = msg.at(-1) || "";
    }
}