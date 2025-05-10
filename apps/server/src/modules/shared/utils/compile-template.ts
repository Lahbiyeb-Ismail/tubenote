import Handlebars from "handlebars";

import { LOGO_PATH } from "../constants";
import type { EmailContent } from "../services";

import { readTemplate } from "./read-template";

type TemplateData = {
  [key: string]: string;
};

/**
 * Compiles HTML and text email templates using Handlebars.
 *
 * @param templateName - The name of the template to compile.
 * @param data - The data to be injected into the template.
 * @returns A promise that resolves to an object containing the compiled HTML and text content, along with the logo path.
 * @throws Will throw an error if the templates cannot be compiled.
 */
export async function compileTemplate(
  templateName: string,
  data: TemplateData
): Promise<EmailContent> {
  try {
    const [htmlTemplate, textTemplate] = await Promise.all([
      readTemplate(templateName, "html"),
      readTemplate(templateName, "txt"),
    ]);

    const compiledHtmlTemplate = Handlebars.compile(htmlTemplate);
    const compiledTextTemplate = Handlebars.compile(textTemplate);

    return {
      htmlContent: compiledHtmlTemplate(data),
      textContent: compiledTextTemplate(data),
      logoPath: LOGO_PATH,
    };
  } catch (error) {
    console.error(`Error compiling templates for ${templateName}:`, error);
    throw new Error(`Failed to compile templates for ${templateName}`);
  }
}
