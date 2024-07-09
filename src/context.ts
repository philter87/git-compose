import { OptionValues } from "commander";
import { ITerminal, TerminalMock } from "./terminal";
import { AppsConfig } from "./steps/apps";

export class Context {
    public config: AppsConfig = {apps: []};

    constructor(
        public terminal: ITerminal = new TerminalMock(),
        public argv: string[] = ["node", "index.js"],
        public opts: OptionValues = {}
    ) {}

    logInfo = (...msg: string[]) : void => {
        this.terminal.logInfo(...msg);
    }

    logError = (...msg: string[]) : void =>{
        this.terminal.logError(...msg);
    }
}
