import { OptionValues } from "commander";
import { ITerminal, Terminal } from "../terminal";

export const deploy = (filePath: string, options: OptionValues, terminal: ITerminal = new Terminal()) => {
    console.log("filePath", filePath)
}