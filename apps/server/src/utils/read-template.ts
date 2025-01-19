import fs from "node:fs/promises";
import path from "node:path";

import { TEMPLATES_DIR } from "@constants/app.contants";

/**
 * Reads a template file from the specified directory and returns its content as a string.
 *
 * @param templateName - The name of the template to read.
 * @param format - The format of the template file, either 'html' or 'txt'.
 * @returns A promise that resolves to the content of the template file as a string.
 * @throws Will throw an error if the template file cannot be read.
 */
async function readTemplate(
  templateName: string,
  format: "html" | "txt"
): Promise<string> {
  const filePath = path.join(
    TEMPLATES_DIR,
    format,
    `${templateName}-template.${format}`
  );
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading ${format} template:`, error);
    throw new Error(`Failed to read ${format} template for ${templateName}`);
  }
}

export default readTemplate;
