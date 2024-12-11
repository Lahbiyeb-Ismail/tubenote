import path from "node:path";

import envConfig from "../config/envConfig";

/**
 * The directory path where the template files are stored.
 * This path is relative to the current directory of the file.
 *
 * @constant {string} TEMPLATES_DIR - The path to the templates directory.
 */
export const TEMPLATES_DIR = path.join(__dirname, "../templates");

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
  "public/images/tubenote-logo.png"
);

/**
 * The base URL for the YouTube API.
 *
 * This constant is retrieved from the environment configuration.
 *
 * @constant {string} YOUTUBE_API_URL - The URL for accessing YouTube API.
 */
export const YOUTUBE_API_URL = envConfig.youtube.api.url;

/**
 * The API key used to authenticate requests to the YouTube API.
 *
 * @constant {string}
 */
export const YOUTUBE_API_KEY = envConfig.youtube.api.key;
