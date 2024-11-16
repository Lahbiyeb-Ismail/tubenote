import fs from 'node:fs';
import path from 'node:path';

import Handlebars from 'handlebars';

import envConfig from '../config/envConfig';

export function createResetPasswordEmail(token: string) {
  const resetLink = `${envConfig.client.url}/password-reset/${token}/`;

  // Read the email templates
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/html', 'reset-password-template.html'),
    'utf-8'
  );
  const textTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/txt', 'reset-password-template.txt'),
    'utf-8'
  );

  // Compile the templates
  const compiledHtmlTemplate = Handlebars.compile(htmlTemplate);
  const compiledTextTemplate = Handlebars.compile(textTemplate);

  // Render the email with the reset link
  const htmlContent = compiledHtmlTemplate({ resetLink });
  const textContent = compiledTextTemplate({ resetLink });

  return { htmlContent, textContent };
}
