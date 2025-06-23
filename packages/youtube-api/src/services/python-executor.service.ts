import { spawn } from "node:child_process";
import path from "node:path";

import type { PythonScriptResult } from "../types";

import { envConfig } from "../env.config";

/**
 * Executes Python scripts with specified arguments and returns the result.
 * This class is primarily used for running the YouTube transcript extraction script.
 */
export class PythonExecutor {
  private scriptPath: string;
  private pythonExecutable: string;

  /**
   * Creates a new PythonExecutor instance.
   *
   * @param pythonExecutable - The Python executable to use (defaults to "python3")
   */
  constructor(pythonExecutable = "python3") {
    this.scriptPath = path.join(__dirname, "../scripts/youtube-transcript.py");
    this.pythonExecutable = pythonExecutable;
  }

  /**
   * Executes the Python script with the provided arguments.
   *
   * @param args - Command line arguments to pass to the Python script
   * @returns A promise that resolves to a PythonScriptResult containing
   *          success status, output (if successful), or error information (if failed)
   * @throws Never throws, all errors are handled and returned in the result object
   */
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
        envConfig.python.scriptTimeout || 30000, // Default to 30 seconds if not set
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
