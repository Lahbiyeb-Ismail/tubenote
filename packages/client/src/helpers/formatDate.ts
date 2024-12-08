/**
 * Formats a date string into a human-readable format.
 *
 * @param dateString - The date string to format.
 * @returns A formatted date string in the "en-US" locale with the following format:
 *          "Month Day, Year, HH:MM:SS AM/PM".
 */
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default formatDate;
