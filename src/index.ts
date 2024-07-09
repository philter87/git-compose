#! /usr/bin/env node

import { Context } from "./context";
import { runProgram } from "./program";
import { Terminal } from "./terminal";


const context = new Context(new Terminal(), process.argv, {})
runProgram(context)
