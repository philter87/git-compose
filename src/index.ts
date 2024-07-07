#! /usr/bin/env node

import { spawnSync } from "child_process";
import { Command } from "commander";
import { validationCheck } from "./steps/validation-check";
import { deploy } from "./steps/deploy";

const figlet = require("figlet");

const program = new Command()

program
    .name("gitco")
    .description("A CLI tool for managing docker-compose deployments with git")
    .version("0.0.1")
    .parse(process.argv);

program
    .command("deploy")
    .description("Deploy docker-compose applications defined in apps.json")
    .argument("[file]", "The path to the app.json file (default: apps.json)", "apps.json")
    .action((file, options) => deploy(file, options))


program.parse(process.argv);

const options = program.opts();



if (!process.argv.slice(2).length) {
    console.log(figlet.textSync("GitCo"));
    program.outputHelp();
}


console.log("\n\nValidating environment...")

const validationErrors = validationCheck()
if(validationErrors.length) {
    validationErrors.forEach(error => console.error(error))
    process.exit(1);
} else {
    console.log("Environment validated successfully.\n")
}