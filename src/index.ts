#! /usr/bin/env node

import { Command } from "commander";

const figlet = require("figlet");

const program = new Command()

console.log(figlet.textSync("GitCo"));

program.version("0.0.1")
    .description("A CLI tool for managing docker-compose deployments with git")
    .option("-d", "--deploy", "Deploy the docker-compose stack")
    .parse(process.argv);


const options = program.opts();



if (!process.argv.slice(2).length) {
    program.outputHelp();
  }