import path from "path"
import { Context } from "./context"
import { runProgram } from "./program"
import { TerminalMock } from "./terminal"

describe("Smoke test", () => {
    it("should pass", async () => {
        const appsFilePath = path.join(__dirname, "fixtures", "apps.json")
        const t = new TerminalMock()
        var c = new Context(t, ["node", "gitco", "deploy", appsFilePath], {})
        
        await runProgram(c)

        // Maybe some weird concurrency issue
        expect(t.commands).toContain("docker")
    })
})