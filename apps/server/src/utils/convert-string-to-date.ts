/**
 * Converts a string representation of a time duration into a Date object.
 *
 * The input string should be in the format of a number followed by a unit,
 * such as "1d" for one day, "2h" for two hours, "30m" for thirty minutes,
 * or "45s" for forty-five seconds.
 *
 * @param {string} input - The string representation of the time duration.
 * @returns {Date} - A Date object representing the current date and time
 *                   adjusted by the specified duration.
 * @throws {Error} - Throws an error if the input is not a non-empty string
 *                   or if the format is invalid.
 * @throws {Error} - Throws an error if the unit is unsupported.
 */
export function stringToDate(input: string): Date {
  if (!input || typeof input !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  const valueMatch = input.match(/\d+/);
  const unitMatch = input.match(/[a-zA-Z]+/);

  if (!valueMatch || !unitMatch) {
    throw new Error(
      'Invalid input format. Expected format: e.g., "1d", "2h", etc.'
    );
  }

  const value = parseInt(valueMatch[0], 10);
  const unit = unitMatch[0];

  const currentDate = new Date();

  switch (unit) {
    case "d":
      currentDate.setDate(currentDate.getDate() + value);
      break;
    case "h":
      currentDate.setHours(currentDate.getHours() + value);
      break;
    case "m":
      currentDate.setMinutes(currentDate.getMinutes() + value);
      break;
    case "s":
      currentDate.setSeconds(currentDate.getSeconds() + value);
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }

  return currentDate;
}
