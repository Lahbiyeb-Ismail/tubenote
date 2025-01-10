const path = require("path");

const buildBiomeCommand = (command) => (filenames) => {
  const files = filenames
    .filter((file) => !file.includes("/dist/") && !file.includes("\\dist\\"))
    .map((f) => path.relative(process.cwd(), f))
    .join(" ");
  return files ? `biome ${command} ${files}` : "true";
};

const buildEslintCommand = buildBiomeCommand("check --apply-unsafe");
const buildPrettierCommand = buildBiomeCommand("format --write");

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, buildPrettierCommand],
  "*.json": [buildPrettierCommand],
};
