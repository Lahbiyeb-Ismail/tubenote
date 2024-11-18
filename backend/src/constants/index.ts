import path from 'node:path';

/**
 * The directory path where the template files are stored.
 * This path is relative to the current directory of the file.
 *
 * @constant {string} TEMPLATES_DIR - The path to the templates directory.
 */
export const TEMPLATES_DIR = path.join(__dirname, '../templates');

/**
 * The path to the Tubenote logo image.
 *
 * This constant constructs the absolute path to the Tubenote logo image
 * located in the 'public/images' directory relative to the current working directory.
 *
 * @constant {string} LOGO_PATH - The absolute path to the Tubenote logo image.
 */
export const LOGO_PATH = path.join(
  process.cwd(),
  'public/images/tubenote-logo.png'
);
