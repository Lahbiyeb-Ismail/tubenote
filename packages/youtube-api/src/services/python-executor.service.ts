import { spawn } from "node:child_process";
import path from "node:path";

import type { PythonScriptResult } from "../types";

export class PythonExecutor {
  private scriptPath: string;
  private pythonExecutable: string;

  constructor(pythonExecutable = "python3") {
    this.scriptPath = path.join(__dirname, "../scripts/youtube-transcript.py");
    this.pythonExecutable = pythonExecutable;
  }

  async executeScript(args: string[]): Promise<PythonScriptResult> {
    return new Promise((resolve) => {
      const child = spawn(this.pythonExecutable, [this.scriptPath, ...args], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      const timeout = setTimeout(
        () => {
          child.kill("SIGKILL");
          resolve({
            success: false,
            error: "Script execution timeout",
            code: -1,
          });
        },
        Number.parseInt(process.env.SCRIPT_TIMEOUT || "30000"),
      );

      child.on("close", (code) => {
        clearTimeout(timeout);

        if (code === 0) {
          resolve({
            success: true,
            output: stdout.trim(),
          });
        }
        else {
          resolve({
            success: false,
            error: stderr.trim() || stdout.trim() || "Unknown error",
            code: code || -1,
          });
        }
      });

      child.on("error", (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.message,
          code: -1,
        });
      });
    });
  }
}
