import fs from 'node:fs';
import path from 'node:path';

import Handlebars from 'handlebars';

import envConfig from '../config/envConfig';

export function createVerificationEmail(token: string) {
  const verificationLink = `${envConfig.server.url}/api/v1/verify-email/${token}`;

  // Read the email templates
  const htmlTemplate = fs.readFileSync(
    path.join(
      __dirname,
      '../templates/html',
      'verification-email-template.html'
    ),
    'utf-8'
  );
  const textTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/txt', 'verification-email-template.txt'),
    'utf-8'
  );

  const logoPath = path.join(process.cwd(), 'public/images/tubenote-logo.png');

  // Compile the templates
  const compiledHtmlTemplate = Handlebars.compile(htmlTemplate);
  const compiledTextTemplate = Handlebars.compile(textTemplate);

  const htmlContent = compiledHtmlTemplate({ verificationLink });
  const textContent = compiledTextTemplate({ verificationLink });

  return { htmlContent, textContent, logoPath };
}

export function createVerifiedEmail() {
  const loginLink = `${envConfig.client.url}/login`;

  // Read the email templates
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/html', 'email-verified-template.html'),
    'utf-8'
  );
  const textTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/txt', 'email-verified-template.txt'),
    'utf-8'
  );

  const logoPath = path.join(process.cwd(), 'public/images/tubenote-logo.png');

  // Compile the templates
  const compiledHtmlTemplate = Handlebars.compile(htmlTemplate);
  const compiledTextTemplate = Handlebars.compile(textTemplate);

  const htmlContent = compiledHtmlTemplate({ loginLink });
  const textContent = compiledTextTemplate({ loginLink });

  return { htmlContent, textContent, logoPath };
}
