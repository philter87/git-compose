import { OptionValues } from "commander";
import { ITerminal, Terminal, TerminalMock } from "./terminal";
import { AppsConfig, } from "./apps";
import { ConfigReader, ConfigReaderMock, IConfigReader } from "./config-reader";
import { DEFAULT_CONFIG_FILE } from "./constants";
import path from "path";

export class Context {
    public terminal: ITerminal = new Terminal();
    public argv: string[] = process.argv;
    public optionValues: OptionValues = {};
    public configFilePath: string = DEFAULT_CONFIG_FILE;
    public configReader: IConfigReader = new ConfigReader();

    logInfo = (...msg: string[]) : void => {
        this.terminal.logInfo(...msg);
    }

    logError = (...msg: string[]) : void =>{
        this.terminal.logError(...msg);
    }

    getAppsConfig = (): AppsConfig => {
        return this.configReader.read(this);
    }


    static createMock = (): Context => {
        const c = new Context();
        c.terminal = new TerminalMock();
        c.configReader = new ConfigReaderMock({apps: []});
        return c;
    }

    withConfigPath = (configPath: string, options: OptionValues = {}): Context => {
        this.configFilePath = path.isAbsolute(configPath) 
            ? configPath 
            : path.join(process.cwd(), configPath)
            
        this.optionValues = options;
        return this;
    }

    withTerminal = (terminal: ITerminal): Context => {
        this.terminal = terminal;
        return this;
    }

    withConfig = (config: AppsConfig): Context => {
        this.configReader = new ConfigReaderMock(config);
        return this;
    }
}
