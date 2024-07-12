import { Command } from "commander";
const figlet = require("figlet");
import { deploy } from "./commands/deploy";
import { validationCheck } from "./commands/validation-check";
import { Context } from "./models/context";

import { DEFAULT_CONFIG_FILE } from "./models/constants";
import { autoDeploy } from "./commands/autodeploy";

export const runProgram = (c: Context) => {
    const program = new Command()

    program
        .name("gitco")
        .description("A CLI tool for managing docker-compose deployments with git")
        .version("0.0.1")

    
    program
        .command("validate")
        .description("Check system requirements for running GitCo")
        .action(async () => await validationCheck(c.terminal))

    program
        .command("deploy")
        .description("Deploy docker-compose applications defined in apps.json if changes detected")
        .argument("[file]", `The path to the '${DEFAULT_CONFIG_FILE}' file (default: ${DEFAULT_CONFIG_FILE})`, DEFAULT_CONFIG_FILE)
        .action(async (file, options) => deploy(c.withConfigPath(file, options)))

    program
        .command("auto")
        .description("Automatically detect repo changes and deploy")
        .argument("[file]", `The path to the '${DEFAULT_CONFIG_FILE}' file (default: ${DEFAULT_CONFIG_FILE})`, DEFAULT_CONFIG_FILE)
        .option("-s, --stop", "Disable the automatic deployment", false)
        .action(async (file, options) => {
            autoDeploy(c.withConfigPath(file, options))
        })


    program.parse(c.argv);
    const options = program.opts();

    

    if (!c.argv.slice(2).length) {
        console.log(figlet.textSync("GitCo"));
        program.outputHelp();
    }    
}