import { Command } from "commander";
const figlet = require("figlet");
import { deploy } from "./steps/deploy";
import { validationCheck } from "./steps/validation-check";
import { Context } from "./context";
import { parseAppsFile } from "./steps/apps";

export const runProgram = (c: Context) => {
    const program = new Command()

    program
        .name("gitco")
        .description("A CLI tool for managing docker-compose deployments with git")
        .version("0.0.1")

    program
        .command("deploy")
        .description("Deploy docker-compose applications defined in apps.json")
        .argument("[file]", "The path to the app.json file (default: apps.json)", "apps.json")
        .action(async (file, options) => deploy(parseAppsFile(c, file)))
    
    program
        .command("validate")
        .description("Check system requirements for running GitCo")
        .action(async () => await validationCheck(c.terminal))


    program.parse(c.argv);
    const options = program.opts();


    if (!c.argv.slice(2).length) {
        console.log(figlet.textSync("GitCo"));
        program.outputHelp();
    }
}