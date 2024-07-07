import { spawnSync } from "child_process";


export interface TerminalResponse {
    msg: string;
    err: string;
}

export interface ITerminal {
    run: (command: string, args: string[]) => TerminalResponse;
}


export class Terminal implements ITerminal {
    run = (command: string, args: string[]) : TerminalResponse => {
        const response = spawnSync(command, args, {encoding: "utf-8"});
        return {
            msg: response.stdout,
            err: response.stderr
        };
    }
}

export class TerminalMock implements ITerminal {
    constructor(private command: string, private args: string[], private response: TerminalResponse) {}

    run = (command: string, args: string[]) : TerminalResponse => {
        if (command === this.command && args.toString() === this.args.toString()) {
            return this.response;
        }

        return {
            msg: "Ok",
            err: ""
        };
    }
}