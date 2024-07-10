#! /usr/bin/env node

import { Context } from "./models/context";
import { runProgram } from "./program";
import { Terminal } from "./models/terminal";

const context = new Context()
runProgram(context)
